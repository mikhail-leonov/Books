import BookService from '../services/bookService';
import Helpers from '../utils/helpers';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const APIBookController = {

    LogPerformance: false,

    async getBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const pagination = Helpers.parsePagination(req.query, { sort: 'created_at', order: 'DESC', limit: 50 });
            const data = await BookService.getAllBooks(pagination);
            Helpers.ok(res, data);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.getBooks = ${duration}`); }
    },

    async getBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid book ID');
            const book = await BookService.getBookById(id);
            if (!book) return Helpers.fail(res, 'Book not found', 404);
            Helpers.ok(res, book);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.getBook = ${duration}`); }
    },

    async postBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = await BookService.createBook(req.body);
            const book = await BookService.getBookById(id);
            Helpers.ok(res, book, 201);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.postBook = ${duration}`); }
    },

    async putBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid book ID');
            const updated = await BookService.updateBook(id, req.body);
            if (!updated) return Helpers.fail(res, 'Book not found', 404);
            Helpers.ok(res, await BookService.getBookById(id));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.putBook = ${duration}`); }
    },

    async removeBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid book ID');
            const deleted = await BookService.deleteBook(id);
            if (!deleted) return Helpers.fail(res, 'Book not found', 404);
            Helpers.ok(res, { message: 'Book deleted' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.removeBook = ${duration}`); }
    },

    async likeBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid book ID');
            await BookService.toggleLike(id, true);
            Helpers.ok(res, await BookService.getBookById(id));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.likeBook = ${duration}`); }
    },

    async unlikeBook(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid book ID');
            await BookService.toggleLike(id, false);
            Helpers.ok(res, await BookService.getBookById(id));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.unlikeBook = ${duration}`); }
    },

    async searchBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const q = (req.query.q as string)?.trim();
            if (!q) return Helpers.fail(res, 'Query is required');
            const pagination = Helpers.parsePagination(req.query, { sort: 'created_at', order: 'DESC', limit: 100 });
            const books = await BookService.getSearchBooks(q, pagination);
            res.json({ success: true, data: books, query: q });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.searchBooks = ${duration}`); }
    },

    async getLikedBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const pagination = Helpers.parsePagination(req.query, { sort: 'created_at', order: 'DESC', limit: 50 });
            const [data, total] = await Promise.all([
                BookService.getAllLikedBooks(pagination),
                BookService.getAllLikedBooksCount(),
            ]);
            res.json({ success: true, data, total });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.getLikedBooks = ${duration}`); }
    },

    async getRecentBooks(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const pagination = Helpers.parsePagination(req.query, { sort: 'created_at', order: 'DESC', limit: 50 });
            const [data, total] = await Promise.all([
                BookService.getAllRecentBooks(pagination),
                BookService.getAllRecentBooksCount(),
            ]);
            res.json({ success: true, data, total });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.getRecentBooks = ${duration}`); }
    },

    async generateAIDescription(req: Request, res: Response, next: NextFunction): Promise<void> {
        logger.error(` - - APIBookController.generateAIDescription`);
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid book ID');
            const description = await BookService.generateAIDescription(id);
            Helpers.ok(res, { ai_description: description });
        } catch (err: any) {
            logger.error(`AI description error: ${err.message}`);
            Helpers.fail(res, err.message, 500);
        }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIBookController.LogPerformance) { logger.error(` - - APIBookController.generateAIDescription = ${duration}`); }
    },

};

export default APIBookController;