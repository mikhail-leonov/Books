import AuthorService from '../services/authorService';
import Helpers from '../utils/helpers';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

const UIAuthorController = {
    LogPerformance: false,

    async searchAuthors(req: Request, res: Response) {
        const start = performance.now();
        const query = req.query.q as string;
        if (!query || query.trim().length === 0) {
            return res.redirect('/authors');
        }
        const totalItems = await AuthorService.getSearchAuthorsCount(query);
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const authors = await AuthorService.getSearchAuthors(query, params);
        Helpers.renderTwig('authors', { authors, searchQuery: query, pagination, title: `Search Authors: ${query}` }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIAuthorController.LogPerformance) { logger.error(` - - UIAuthorController.searchAuthors = ${duration}`); }
    },

    async showAuthors(req: Request, res: Response) {
        const start = performance.now();
        const totalItems = await AuthorService.getAllAuthorsCount();
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const authors = await AuthorService.getAllAuthors(params);
        Helpers.renderTwig('authors', { authors, pagination }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIAuthorController.LogPerformance) { logger.error(` - - UIAuthorController.showAuthors = ${duration}`); }
    },

    async showAuthorBooks(req: Request, res: Response) {
        const start = performance.now();
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).send('Invalid author ID');
        const author = await AuthorService.getAuthorById(id);
        if (!author) return res.status(404).send('Author not found');
        const totalItems = await AuthorService.getAuthorBooksCount(id);
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const books = await AuthorService.getAuthorBooks(id, params);
        Helpers.renderTwig('entity_books', { entity: author, type: 'Author', books, pagination }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIAuthorController.LogPerformance) { logger.error(` - - UIAuthorController.showAuthorBooks = ${duration}`); }
    },

};

export default UIAuthorController;