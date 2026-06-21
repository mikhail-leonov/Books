import BookService from '../services/bookService';
import GroupService from '../services/groupService';
import Helpers from '../utils/helpers';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';
import { fb2 } from '../utils/fb2';

const UIBookController = {
    LogPerformance: false,

    async showHome(req: Request, res: Response) {
        const start = performance.now();
        const totalItems = await BookService.getAllBooksCount();
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const books = await BookService.getAllBooks(params);
        Helpers.renderTwig('index', { books, pagination }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIBookController.LogPerformance) { logger.error(` - - UIBookController.showHome = ${duration}`); }
    },

    async showLikedBooks(req: Request, res: Response) {
        const start = performance.now();
        const totalItems = await BookService.getAllLikedBooksCount();
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const books = await BookService.getAllLikedBooks(params);
        Helpers.renderTwig('index', { books, pagination, title: "Liked Books" }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIBookController.LogPerformance) { logger.error(` - - UIBookController.showLikedBooks = ${duration}`); }
    },

    async showRecentBooks(req: Request, res: Response) {
        const start = performance.now();
        const totalItems = await BookService.getAllRecentBooksCount();
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const books = await BookService.getAllRecentBooks(params);
        Helpers.renderTwig('index', { books, pagination, title: "Recent Books" }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIBookController.LogPerformance) { logger.error(` - - UIBookController.showRecentBooks = ${duration}`); }
    },

    async searchBooks(req: Request, res: Response) {
        const start = performance.now();
        const query = req.query.q as string;
        if (!query || query.trim().length === 0) {
            return res.redirect('/');
        }
        const totalItems = await BookService.getSearchBooksCount(query);
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const books = await BookService.getSearchBooks(query, params);
        Helpers.renderTwig('index', { books, searchQuery: query, pagination, title: "Search" }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIBookController.LogPerformance) { logger.error(` - - UIBookController.searchBooks = ${duration}`); }
    },

    async showReadBook(req: Request, res: Response) {
        const start = performance.now();
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).send('Invalid book ID');
        const book = await BookService.getBookById(id);
        if (!book) return res.status(404).send('Book not found');
        book.groups = await BookService.enumerateGroups(id);
        const { content, filePath } = await BookService.getBookContentById(id);
        if (!content) {
            return res.status(404).send(`Book file not found on disk: ${filePath || 'unknown path'}`);
        }
        const formattedContent = fb2.formatToHtml(content);
        const allGroups = await GroupService.getAllGroupsEx();
        Helpers.renderTwig('read', { book, formattedContent, allGroups }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIBookController.LogPerformance) { logger.error(` - - UIBookController.showReadBook = ${duration}`); }
    },

};

export default UIBookController;