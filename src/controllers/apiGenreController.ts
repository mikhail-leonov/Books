import GenreService from '../services/genreService';
import Helpers from '../utils/helpers';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const APIGenreController = {

    LogPerformance: false,

    async getGenres(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const pagination = Helpers.parsePagination(req.query, { sort: 'name', order: 'ASC', limit: 100 });
            Helpers.ok(res, await GenreService.getAllGenres(pagination));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGenreController.LogPerformance) { logger.error(` - - APIGenreController.getGenres = ${duration}`); }
    },
    async getGenre(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const genre = await GenreService.getGenreById(req.params.id);
            if (!genre) return Helpers.fail(res, 'Genre not found', 404);
            Helpers.ok(res, genre);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGenreController.LogPerformance) { logger.error(` - - APIGenreController.getGenre = ${duration}`); }
    },
    async postGenre(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const { id, name } = req.body;
            if (!id || !name) return Helpers.fail(res, 'Genre id and name are required');
            const created = await GenreService.createGenre(id, name);
            if (!created) return Helpers.fail(res, 'Genre already exists', 409);
            Helpers.ok(res, await GenreService.getGenreById(id), 201);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGenreController.LogPerformance) { logger.error(` - - APIGenreController.postGenre = ${duration}`); }
    },
    async putGenre(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const { id } = req.params;
            const name = req.body.name?.trim();
            if (!name) return Helpers.fail(res, 'Genre name is required');
            const updated = await GenreService.updateGenre(id, name);
            if (!updated) return Helpers.fail(res, 'Genre not found', 404);
            Helpers.ok(res, await GenreService.getGenreById(id));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGenreController.LogPerformance) { logger.error(` - - APIGenreController.putGenre = ${duration}`); }
    },
    async removeGenre(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const { id } = req.params;
            const deleted = await GenreService.deleteGenre(id);
            if (!deleted) return Helpers.fail(res, 'Genre not found', 404);
            await GenreService.deleteGenreBooks(id);
            Helpers.ok(res, { message: 'Genre deleted' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGenreController.LogPerformance) { logger.error(` - - APIGenreController.removeGenre = ${duration}`); }
    },
    async mergeGenres(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const keepId = req.body.keep_id;
            const mergeId = req.body.merge_id;
            if (keepId === mergeId) return Helpers.fail(res, 'Cannot merge a genre with itself');
            await GenreService.mergeGenreService(keepId, mergeId);
            Helpers.ok(res, { message: 'Genres merged successfully' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGenreController.LogPerformance) { logger.error(` - - APIGenreController.mergeGenres = ${duration}`); }
    },

};

export default APIGenreController;