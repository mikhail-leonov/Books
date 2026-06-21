import SerieService from '../services/seriesService';
import Helpers from '../utils/helpers';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const APISerieController = {

    LogPerformance: false,

    async getSeries(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const pagination = Helpers.parsePagination(req.query, { sort: 'name', order: 'ASC', limit: 100 });
            Helpers.ok(res, await SerieService.getAllSeries(pagination));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APISerieController.LogPerformance) { logger.error(` - - APISerieController.getSeries = ${duration}`); }
    },

    async getSerie(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid series ID');
            const serie = await SerieService.getSerieById(id);
            if (!serie) return Helpers.fail(res, 'Series not found', 404);
            Helpers.ok(res, serie);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APISerieController.LogPerformance) { logger.error(` - - APISerieController.getSerie = ${duration}`); }
    },
    async postSerie(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const name = req.body.name?.trim();
            if (!name) return Helpers.fail(res, 'Series name is required');
            const id = await SerieService.createSerie(name);
            Helpers.ok(res, await SerieService.getSerieById(id), 201);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APISerieController.LogPerformance) { logger.error(` - - APISerieController.postSerie = ${duration}`); }
    },
    async putSerie(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid series ID');
            const name = req.body.name?.trim();
            if (!name) return Helpers.fail(res, 'Series name is required');
            const updated = await SerieService.updateSerie(id, name);
            if (!updated) return Helpers.fail(res, 'Series not found', 404);
            Helpers.ok(res, await SerieService.getSerieById(id));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APISerieController.LogPerformance) { logger.error(` - - APISerieController.putSerie = ${duration}`); }
    },
    async removeSerie(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid series ID');
            const deleted = await SerieService.deleteSerie(id);
            if (!deleted) return Helpers.fail(res, 'Series not found', 404);
            Helpers.ok(res, { message: 'Series deleted' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APISerieController.LogPerformance) { logger.error(` - - APISerieController.removeSerie = ${duration}`); }
    },
    async mergeSerie(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const keepId = Helpers.parseIntParam(req.body.keep_id);
            const mergeId = Helpers.parseIntParam(req.body.merge_id);
            if (isNaN(keepId) || isNaN(mergeId)) return Helpers.fail(res, 'Invalid serie IDs');
            if (keepId === mergeId) return Helpers.fail(res, 'Cannot merge a serie with itself');
            await SerieService.mergeSerieService(keepId, mergeId);
            Helpers.ok(res, { message: 'Series merged successfully' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APISerieController.LogPerformance) { logger.error(` - - APISerieController.mergeSerie = ${duration}`); }
    },

};

export default APISerieController;