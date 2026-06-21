import SerieService from '../services/seriesService';
import Helpers from '../utils/helpers';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

const UISeriesController = {

    LogPerformance: false,

    async showSeries(req: Request, res: Response) {
        const start = performance.now();
        const totalItems = await SerieService.getAllSeriesCount();
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const series = await SerieService.getAllSeries(params);
        Helpers.renderTwig('series', { series, pagination }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UISeriesController.LogPerformance) { logger.error(` - - UISeriesController.showSeries = ${duration}`); }
    },

    async showSeriesBooks(req: Request, res: Response) {
        const start = performance.now();
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).send('Invalid series ID');
        const series = await SerieService.getSerieById(id);
        if (!series) return res.status(404).send('Series not found');
        const totalItems = await SerieService.getSerieBooksCount(id);
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const books = await SerieService.getSerieBooks(id, params);
        Helpers.renderTwig('entity_books', { entity: series, type: 'Series', books, pagination }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UISeriesController.LogPerformance) { logger.error(` - - UISeriesController.showSeriesBooks = ${duration}`); }
    },

    async searchSeries(req: Request, res: Response) {
        const start = performance.now();
        const query = req.query.q as string;
        if (!query || query.trim().length === 0) {
            return res.redirect('/series');
        }
        const totalItems = await SerieService.getSearchSeriesCount(query);
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const series = await SerieService.getSearchSeries(query, params);
        Helpers.renderTwig('series', { series, searchQuery: query, pagination, title: `Search Series: ${query}` }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UISeriesController.LogPerformance) { logger.error(` - - UISeriesController.searchSeries = ${duration}`); }
    },


};

export default UISeriesController;