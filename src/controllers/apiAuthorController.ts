import AuthorService from '../services/authorService';
import Helpers from '../utils/helpers';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const APIAuthorController = {

    LogPerformance: false,

    async getAuthors(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const pagination = Helpers.parsePagination(req.query, { sort: 'name', order: 'ASC', limit: 100 });
            Helpers.ok(res, await AuthorService.getAllAuthors(pagination));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIAuthorController.LogPerformance) { logger.error(` - - APIAuthorController.getAuthors = ${duration}`); }
    },

    async getSearchAuthors(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const q = (req.query.q as string)?.trim();
            if (!q) return Helpers.fail(res, 'Query is required');
            const pagination = Helpers.parsePagination(req.query, { sort: 'name', order: 'ASC', limit: 100 });
            Helpers.ok(res, await AuthorService.getSearchAuthors(q, pagination));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIAuthorController.LogPerformance) { logger.error(` - - APIAuthorController.getSearchAuthors = ${duration}`); }
    },

    async getAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid author ID');
            const author = await AuthorService.getAuthorById(id);
            if (!author) return Helpers.fail(res, 'Author not found', 404);
            Helpers.ok(res, author);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIAuthorController.LogPerformance) { logger.error(` - - APIAuthorController.getAuthor = ${duration}`); }
    },

    async postAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const name = req.body.name?.trim();
            if (!name) return Helpers.fail(res, 'Author name is required');
            const id = await AuthorService.createAuthor(name);
            Helpers.ok(res, await AuthorService.getAuthorById(id), 201);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIAuthorController.LogPerformance) { logger.error(` - - APIAuthorController.postAuthor = ${duration}`); }
    },

    async putAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid author ID');
            const name = req.body.name?.trim();
            if (!name) return Helpers.fail(res, 'Author name is required');
            const updated = await AuthorService.updateAuthor(id, name);
            if (!updated) return Helpers.fail(res, 'Author not found', 404);
            Helpers.ok(res, await AuthorService.getAuthorById(id));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIAuthorController.LogPerformance) { logger.error(` - - APIAuthorController.putAuthor = ${duration}`); }
    },

    async removeAuthor(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid author ID');
            const deleted = await AuthorService.deleteAuthor(id);
            if (!deleted) return Helpers.fail(res, 'Author not found', 404);
            Helpers.ok(res, { message: 'Author deleted' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIAuthorController.LogPerformance) { logger.error(` - - APIAuthorController.removeAuthor = ${duration}`); }
    },

    async mergeAuthors(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const keepId = Helpers.parseIntParam(req.body.keep_id);
            const mergeId = Helpers.parseIntParam(req.body.merge_id);
            if (isNaN(keepId) || isNaN(mergeId)) return Helpers.fail(res, 'Invalid author IDs');
            if (keepId === mergeId) return Helpers.fail(res, 'Cannot merge an author with itself');
            await AuthorService.mergeAuthorsService(keepId, mergeId);
            Helpers.ok(res, { message: 'Authors merged successfully' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIAuthorController.LogPerformance) { logger.error(` - - APIAuthorController.mergeAuthors = ${duration}`); }
    },

};

export default APIAuthorController;