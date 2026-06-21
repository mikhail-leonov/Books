import GenreService from '../services/genreService';
import Helpers from '../utils/helpers';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

const UIGenreController = {

    LogPerformance: false,

    async searchGenres(req: Request, res: Response) {
        const start = performance.now();
        const query = req.query.q as string;
        if (!query || query.trim().length === 0) {
            return res.redirect('/genres');
        }
        const totalItems = await GenreService.getSearchGenresCount(query);
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const genres = await GenreService.getSearchGenres(query, params);
        Helpers.renderTwig('genres', { genres, searchQuery: query, pagination, title: `Search Genres: ${query}` }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIGenreController.LogPerformance) { logger.error(` - - UIGenreController.searchGenres = ${duration}`); }
    },

    async showGenres(req: Request, res: Response) {
        const start = performance.now();
        const totalItems = await GenreService.getAllGenresCount();
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const genres = await GenreService.getAllGenres(params);
        Helpers.renderTwig('genres', { genres, pagination }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIGenreController.LogPerformance) { logger.error(` - - UIGenreController.showGenres = ${duration}`); }
    },

    async showGenreBooks(req: Request, res: Response) {
        const start = performance.now();
        const id = req.params.id;
        const genre = await GenreService.getGenreById(id);
        if (!genre) return res.status(404).send('Genre not found');
        const totalItems = await GenreService.getGenreBooksCount(id);
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const books = await GenreService.getGenreBooks(id, params);
        Helpers.renderTwig('entity_books', { entity: genre, type: 'Genre', books, pagination }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIGenreController.LogPerformance) { logger.error(` - - UIGenreController.showGenreBooks = ${duration}`); }
    },

};

export default UIGenreController;