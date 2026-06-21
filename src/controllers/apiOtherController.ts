import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

import { Request, Response, NextFunction } from 'express';
import BookService from '../services/bookService';
import ImportService from '../services/importService';
import Helpers from '../utils/helpers';
import { logger } from '../utils/logger';


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
        if (APIOtherController.LogPerformance) { logger.error(` - - APIOtherController.runManualImport = ${duration}`); }
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
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIOtherController.LogPerformance) { logger.error(` - - APIOtherController.emailBook = ${duration}`); }
    },

    async uploadFiles(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                return Helpers.fail(res, 'No files uploaded', 400);
            }
            let files = req.files.files;
            if (!files) { return Helpers.fail(res, 'No field "files" found', 400); }
            if (!Array.isArray(files)) { files = [files]; }
    
            let originalNames = req.body.originalNames;
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
                return Helpers.fail(res, 'Inbox directory does not exist. Please create it manually or restart the server.', 500);
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
    
            Helpers.ok(res, { uploaded: uploadedNames, message: `${uploadedNames.length} file(s) uploaded to inbox` });
        } catch (err) {
            next(err);
        }
    }

};

export default APIOtherController;