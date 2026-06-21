import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import crypto from 'crypto';

import BookModel from './bookModel';
import BookDB from '../db/bookDB';

import { fb2 } from '../utils/fb2';
import { logger } from '../utils/logger';
import pc from 'picocolors';
import { waitForFileStableFb2 } from '../utils/waitForFileStable';

const INBOX_DIR = path.join(process.cwd(), 'inbox');
const LIBRARY_DIR = path.join(process.cwd(), 'library');
const FAILED_DIR = path.join(process.cwd(), 'failed');

const ImportModel = {
    LogPerformance: false,

    async runImport(): Promise<{ processed: number; errors: number; log: string[] }> {
        const start = performance.now();
        const log: string[] = [];
        let processed = 0;
        let errors = 0;

        log.push(`[${new Date().toISOString()}] Starting import from: ${INBOX_DIR}`);

        if (!fs.existsSync(INBOX_DIR)) {
            fs.mkdirSync(INBOX_DIR, { recursive: true });
            log.push('Created inbox directory');
            const duration = ((performance.now() - start) / 1000).toFixed(2);
            if (this.LogPerformance) { logger.error(` - - ImportModel.runImport = ${duration}`); }
            return { processed, errors, log };
        }

        const zipFiles = this.getZipFiles(INBOX_DIR);
        log.push(`Found ${zipFiles.length} zip files to process`);

        for (const fullPath of zipFiles) {
            try {
                await this.extractZip(fullPath, INBOX_DIR);
                await fs.promises.unlink(fullPath);
            } catch {
            }
        }

        const fb2Files = this.getFB2Files(INBOX_DIR);
        log.push(`Found ${fb2Files.length} fb2 files to import`);
        for (const fullPath of fb2Files) {
            try {
                const success = await this.processSingleFb2File(fullPath, log);
                if (success) processed++; else errors++;
            } catch {
                errors++;
            }
        }

        log.push(`Import finished. Processed: ${processed}, Errors: ${errors}`);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - ImportModel.runImport = ${duration}`); }
        return { processed, errors, log };
    },

    async processSingleFb2File(filePath: string, log: string[]): Promise<boolean> {
        let result = true;
        let importResult = "";
        let metadata: any;
        let showLog = false;

        const fileName = path.basename(filePath);
        const start = performance.now();

        if (!fs.existsSync(filePath)) {
            result = false;
            showLog = true;
            importResult = "not exists";
        }

        await waitForFileStableFb2(filePath);

        const stats = await fs.promises.stat(filePath);
        if (stats.size === 0) {
            await fs.promises.unlink(filePath);
            await this.deleteEmptyParentDirs(filePath);
            result = false;
            importResult = "failed";
        } else {

            // Declared outside the try so the catch can reference it even if
            // beginTransaction() throws (in which case conn stays undefined).
            let conn: any;
            try {
                conn = await BookDB.beginTransaction();

                const buffer = await fs.promises.readFile(filePath);
                const extracted = await fb2.extractMetadataFromBuffer(buffer);

                metadata = extracted.metadata;
                metadata.groups = [];
                metadata.import_key = path.parse(fileName).name;

                const relativePath = path.relative(INBOX_DIR, filePath);
                const pathSegments = relativePath.split(path.sep);
                if (pathSegments.length > 1) {
                    metadata.groups = pathSegments.slice(0, -1);
                }
                const filterResult = fb2.shouldSkip(metadata, filePath, extracted.encoding, false);
                if (filterResult.skip) {
                    importResult = `reject: ${filterResult.reason}`;
                    if (filterResult.code >= 9) {
                        showLog = true;
                        try {
                            const dir = path.dirname(filePath);
                            const ext = path.extname(filePath);
                            const basename = path.basename(filePath, ext);
                            const targetDir = path.join(dir, filterResult.code);
                            await fs.promises.mkdir(targetDir, { recursive: true });
                            const newPath = path.join(targetDir, `${basename}${ext}`);
                            await fs.promises.rename(filePath, newPath);
                        } catch {
                        }
                    } else {
                        await fs.promises.unlink(filePath);
                        await this.deleteEmptyParentDirs(filePath);
                    }
                    result = false;
                } else {
                    const fileHash = this.computeHashFromBuffer(buffer);
                    const libraryPath = path.join(LIBRARY_DIR, `${fileHash}.fb2`);

                    await fs.promises.mkdir(LIBRARY_DIR, { recursive: true });
                    await fs.promises.writeFile(libraryPath, buffer);

                    await BookModel.processBookMetadata(metadata, libraryPath);
                    await fs.promises.unlink(filePath);
                    await this.deleteEmptyParentDirs(filePath);

                    importResult = "ok";
                    result = true;
                }
                await BookDB.commitTransaction(conn);

            } catch (err: any) {

                // Only roll back if a transaction was actually opened, and
                // never let a rollback failure mask the original error.
                if (conn) {
                    try {
                        await BookDB.rollbackTransaction(conn);
                    } catch (rollbackErr) {
                        logger.error(`[processSingleFb2File] Rollback failed for ${fileName}: ${String(rollbackErr)}`);
                    }
                }

                // Log the full error details
                logger.error(`[processSingleFb2File] Error for ${fileName}:`);
                if (err instanceof Error) {
                    logger.error(`  Message: ${err.message}`);
                    logger.error(`  Stack: ${err.stack}`);
                } else {
                    logger.error(`  Non-Error thrown: ${typeof err} = ${String(err)}`);
                }
                result = false;
                importResult = "ex";
            }
        }

        const meta = metadata
            ? `(${metadata.lang}, ${metadata.authors?.join(', ')}, ${metadata.genres?.join(', ')})`
            : '(no metadata)';

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        const logLine = ` - ${fileName} ${meta} = [ ${importResult} ] (${duration}s)`;
        if (showLog) { log.push(logLine); }
        logger.error(logLine);

        return result;
    },

    async extractZip(zipPath: string, extractTo: string): Promise<void> {
        const start = performance.now();
        const directory = await unzipper.Open.file(zipPath);
        for (const entry of directory.files) {
            const normalized = path.normalize(entry.path);
            if (normalized.includes('..') || path.isAbsolute(normalized)) {
                continue;
            }
            const destPath = path.join(extractTo, normalized);
            if (entry.type === 'Directory') {
                await fs.promises.mkdir(destPath, { recursive: true });
                continue;
            }
            await fs.promises.mkdir(path.dirname(destPath), { recursive: true });
            const readStream = entry.stream();
            const writeStream = createWriteStream(destPath);
            await pipeline(readStream, writeStream);
        }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - ImportModel.extractZip = ${duration}`); }
    },

    async deleteEmptyParentDirs(filePath: string): Promise<void> {
        const start = performance.now();
        let currentDir = path.dirname(filePath);
        while (currentDir !== INBOX_DIR && currentDir !== path.parse(currentDir).root) {
            try {
                const items = await fs.promises.readdir(currentDir);
                if (items.length === 0) {
                    await fs.promises.rmdir(currentDir);
                    currentDir = path.dirname(currentDir);
                } else {
                    break;
                }
            } catch {
                break;
            }
        }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - ImportModel.deleteEmptyParentDirs = ${duration}`); }
    },

    getZipFiles(dir: string): string[] {
        let results: string[] = [];
        const list = fs.readdirSync(dir, { withFileTypes: true });
        list.forEach((file) => {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                results = results.concat(this.getZipFiles(fullPath));
            } else {
                if (path.extname(file.name).toLowerCase() === '.zip') {
                    results.push(fullPath);
                }
            }
        });
        return results;
    },

    getFB2Files(dir: string): string[] {
        let results: string[] = [];
        const list = fs.readdirSync(dir, { withFileTypes: true });
        list.forEach((file) => {
            const fullPath = path.join(dir, file.name);
            if (file.isDirectory()) {
                results = results.concat(this.getFB2Files(fullPath));
            } else {
                if (path.extname(file.name).toLowerCase() === '.fb2') {
                    results.push(fullPath);
                }
            }
        });
        return results;
    },

    computeHashFromBuffer(buffer: Buffer): string {
        return crypto.createHash('md5').update(buffer).digest('hex');
    },
};

export default ImportModel;