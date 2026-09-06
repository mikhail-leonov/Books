import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { Request, Response, NextFunction } from 'express';
import BookService from '../services/bookService';
import ImportService from '../services/importService';
import BookDB from '../db/bookDB';
import Helpers from '../utils/helpers';
import { logger } from '../utils/logger';

const GROUP_SQL_DIR = process.env.GROUP_SQL_DIR
  ? path.resolve(process.env.GROUP_SQL_DIR)
  : path.join(process.cwd(), 'src', 'sql', 'groups');

function isTransactionControl(statement: string): boolean {
  return /^(start\s+transaction|begin|commit|rollback)$/i.test(statement.trim());
}

function hasExecutableContent(statement: string): boolean {
  const cleaned = statement
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/--[^\n]*/g, '')
    .replace(/#[^\n]*/g, '')
    .trim();

  return cleaned.length > 0 && !isTransactionControl(cleaned);
}

function splitSqlStatements(sql: string): string[] {
  const statements: string[] = [];

  let current = '';
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < sql.length; i++) {
    const ch = sql[i];
    const prev = i > 0 ? sql[i - 1] : '';
    const next = sql[i + 1];

    if (inLineComment) {
      current += ch;

      if (ch === '\n') {
        inLineComment = false;
      }

      continue;
    }

    if (inBlockComment) {
      current += ch;

      if (ch === '*' && next === '/') {
        current += next;
        i++;
        inBlockComment = false;
      }

      continue;
    }

    if (inSingleQuote) {
      current += ch;

      if (ch === "'") {
        if (next === "'") {
          current += next;
          i++;
        } else if (prev !== '\\') {
          inSingleQuote = false;
        }
      }

      continue;
    }

    if (inDoubleQuote) {
      current += ch;

      if (ch === '"') {
        if (next === '"') {
          current += next;
          i++;
        } else if (prev !== '\\') {
          inDoubleQuote = false;
        }
      }

      continue;
    }

    if (inBacktick) {
      current += ch;

      if (ch === '`') {
        inBacktick = false;
      }

      continue;
    }

    if (ch === '-' && next === '-') {
      inLineComment = true;
      current += ch;
      continue;
    }

    if (ch === '#') {
      inLineComment = true;
      current += ch;
      continue;
    }

    if (ch === '/' && next === '*') {
      inBlockComment = true;
      current += ch;
      continue;
    }

    if (ch === "'") {
      inSingleQuote = true;
      current += ch;
      continue;
    }

    if (ch === '"') {
      inDoubleQuote = true;
      current += ch;
      continue;
    }

    if (ch === '`') {
      inBacktick = true;
      current += ch;
      continue;
    }

    if (ch === ';') {
      const statement = current.trim();

      if (statement) {
        statements.push(statement);
      }

      current = '';
      continue;
    }

    current += ch;
  }

  const lastStatement = current.trim();

  if (lastStatement) {
    statements.push(lastStatement);
  }

  return statements;
}

async function executeGroupSqlFile(conn: any, filePath: string): Promise<boolean> {
  let sql = await fs.promises.readFile(filePath, 'utf8');

  if (sql.charCodeAt(0) === 0xfeff) {
    sql = sql.slice(1);
  }

  sql = sql.trim();

  if (!sql) {
    return false;
  }

  const statements = splitSqlStatements(sql).filter(hasExecutableContent);

  if (statements.length === 0) {
    return false;
  }

  for (const statement of statements) {
    await conn.query(statement);
  }

  return true;
}

const APIOtherController = {
  LogPerformance: false,

  async runManualImport(req: Request, res: Response, next: NextFunction): Promise<void> {
    const start = performance.now();

    try {
      const result = await ImportService.runImport();
      Helpers.ok(res, result);
    } catch (err) {
      logger.error('Import error:', err);
      next(err);
    }

    const duration = ((performance.now() - start) / 1000).toFixed(2);
    if (APIOtherController.LogPerformance) {
      logger.error(` - - APIOtherController.runManualImport = ${duration}`);
    }
  },

  async emailBook(req: Request, res: Response, next: NextFunction): Promise<void> {
    const start = performance.now();

    try {
      const id = Helpers.parseIntParam(req.params.id);
      if (isNaN(id)) return Helpers.fail(res, 'Invalid book ID');

      const mail = req.params.mail;

      const book = await BookService.getBookById(id);
      if (!book) return Helpers.fail(res, 'Book not found', 404);

      if (!book.file_path || !fs.existsSync(book.file_path)) {
        return Helpers.fail(res, 'Book file not found on disk', 404);
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: mail,
        subject: `Book: ${book.title}`,
        text: `Book sent by email in attachement`,
        attachments: [{ filename: path.basename(book.file_path), path: book.file_path }],
      });

      Helpers.ok(res, { message: 'Email sent' });
    } catch (err) {
      next(err);
    }

    const duration = ((performance.now() - start) / 1000).toFixed(2);
    if (APIOtherController.LogPerformance) {
      logger.error(` - - APIOtherController.emailBook = ${duration}`);
    }
  },

  async uploadFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.files || Object.keys(req.files).length === 0) {
        return Helpers.fail(res, 'No files uploaded', 400);
      }

      let files: any = (req.files as any)?.files;

      if (!files) {
        return Helpers.fail(res, 'No field "files" found', 400);
      }

      if (!Array.isArray(files)) {
        files = [files];
      }

      let originalNames: any = req.body?.originalNames;

      if (!originalNames) {
        return Helpers.fail(res, 'Missing originalNames field', 400);
      }

      if (!Array.isArray(originalNames)) {
        originalNames = [originalNames];
      }

      if (originalNames.length !== files.length) {
        return Helpers.fail(res, 'Mismatch between files and originalNames', 400);
      }

      const inboxDir = path.join(process.cwd(), 'inbox');

      if (!fs.existsSync(inboxDir)) {
        return Helpers.fail(
          res,
          'Inbox directory does not exist. Please create it manually or restart the server.',
          500
        );
      }

      const uploadedNames: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const decodedBase64 = originalNames[i];

        let originalName: string;

        try {
          const binary = atob(decodedBase64);
          originalName = decodeURIComponent(escape(binary));
        } catch (err) {
          originalName = file.name;
        }

        let filename = path.basename(originalName);
        filename = filename.replace(/\.\./g, '').replace(/[\\/]/g, '');

        if (!filename || filename === '.' || filename === '..') {
          const ext = path.extname(filename) || '.fb2';
          filename = `upload_${Date.now()}${ext}`;
        }

        const targetPath = path.join(inboxDir, filename);

        await file.mv(targetPath);

        uploadedNames.push(filename);
      }

      Helpers.ok(res, {
        uploaded: uploadedNames,
        message: `${uploadedNames.length} file(s) uploaded to inbox`,
      });
    } catch (err) {
      next(err);
    }
  },

  async importGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
    const start = performance.now();

    try {
      if (!fs.existsSync(GROUP_SQL_DIR)) {
        Helpers.fail(res, `SQL groups directory not found: ${GROUP_SQL_DIR}`, 500);
        return;
      }

      const files = fs
        .readdirSync(GROUP_SQL_DIR, { withFileTypes: true })
        .filter(entry => entry.isFile() && entry.name.toLowerCase().endsWith('.sql'))
        .map(entry => entry.name)
        .sort((a, b) => a.localeCompare(b));

      if (files.length === 0) {
        Helpers.ok(res, {
          message: 'No .sql files found',
          dir: GROUP_SQL_DIR,
          executed: [],
          skipped: [],
        });
        return;
      }

      const executed: string[] = [];
      const skipped: string[] = [];

      let conn: any;
      let currentFile = '';

      try {
        conn = await BookDB.beginTransaction();

        for (const file of files) {
          currentFile = file;

          const filePath = path.join(GROUP_SQL_DIR, file);
          const wasExecuted = await executeGroupSqlFile(conn, filePath);

          if (wasExecuted) {
            executed.push(file);
          } else {
            skipped.push(file);
          }
        }

        await BookDB.commitTransaction(conn);
      } catch (err: any) {
        if (conn) {
          try {
            await BookDB.rollbackTransaction(conn);
          } catch (rollbackErr: any) {
            logger.error(`Import groups rollback failed: ${rollbackErr.message}`);
          }
        }

        throw new Error(`${currentFile ? currentFile + ': ' : ''}${err.message}`);
      }

      Helpers.ok(res, {
        message: `Imported ${executed.length} group SQL file(s)`,
        dir: GROUP_SQL_DIR,
        executed,
        skipped,
      });
    } catch (err: any) {
      logger.error(`Import groups error: ${err.message}`);
      Helpers.fail(res, `Failed to import group SQL files: ${err.message}`, 500);
    }

    const duration = ((performance.now() - start) / 1000).toFixed(2);
    if (APIOtherController.LogPerformance) {
      logger.error(` - - APIOtherController.importGroups = ${duration}`);
    }
  },
};

export default APIOtherController;