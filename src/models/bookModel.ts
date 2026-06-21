import fs from 'fs';
import BookDB from '../db/bookDB';
import { Book, EnrichedBook, PaginationParams, FileContent } from '../types/types';
import Enricher from '../utils/enricher';
import Helpers from '../utils/helpers';
import { logger } from '../utils/logger';

const BookModel = {

    async getAllBooksCount(): Promise<number> {
        return await BookDB.getAllBooksCount();
    },

    async getAllBooks(pagination: PaginationParams): Promise<EnrichedBook[]> {
        Helpers.validatePagination(pagination);
        const books = await BookDB.getAllBooks(pagination);
        return await Enricher.enrich(books);
    },

    async getAllLikedBooksCount(): Promise<number> {
        return await BookDB.getAllLikedBooksCount();
    },

    async getAllLikedBooks(pagination: PaginationParams): Promise<EnrichedBook[]> {
        Helpers.validatePagination(pagination);
        const books = await BookDB.getAllLikedBooks(pagination);
        return await Enricher.enrich(books);
    },

    async getAllRecentBooksCount(): Promise<number> {
        return await BookDB.getAllRecentBooksCount();
    },

    async getAllRecentBooks(pagination: PaginationParams): Promise<EnrichedBook[]> {
        Helpers.validatePagination(pagination);
        const books = await BookDB.getAllRecentBooks(pagination);
        return await Enricher.enrich(books);
    },

    async getSearchBooksCount(query: string): Promise<number> {
        return await BookDB.getSearchBooksCount(query);
    },

    async getSearchBooks(query: string, pagination: PaginationParams): Promise<EnrichedBook[]> {
        Helpers.validatePagination(pagination);
        const books = await BookDB.getSearchBooks(query, pagination);
        return await Enricher.enrich(books);
    },

    async getBookById(id: number): Promise<any> {
        const book = await BookDB.getBookById(id);
        if (!book) return null;
        const enriched = await Enricher.enrich([book]);
        return enriched[0] || null;
    },

    async getBookContentById(id: number): Promise<FileContent> {
        const book = await this.getBookById(id);
        let result: FileContent = { content: null, filePath: null };
        if (book?.file_path) {
            const safePath = Helpers.sanitizeFilePath(book.file_path);
            try {
                const content = fs.readFileSync(safePath, 'utf-8');
                result = { content, filePath: book.file_path };
            } catch {
                result = { content: null, filePath: book.file_path };
            }
        }
        return result;
    },

    async createBook(data: Partial<Book>): Promise<number> {
        const error = Helpers.validateBookData(data);
        if (error) throw new Error(error);
        return await BookDB.createBook(data);
    },

    async updateBook(id: number, updates: Partial<Book>): Promise<boolean> {
        const error = Helpers.validateBookData(updates);
        if (error) throw new Error(error);
        try {
            const changed = await BookDB.updateBook(id, updates);
            return changed;
        } catch (err) {
            throw err;
        }
    },

    async updateAIDescription(id: number, description: string): Promise<boolean> {
        logger.error(` - - BookModel.updateAIDescription(${id}, ${description})`);

        return await BookDB.updateAIDescription(id, description);
    },

    async deleteBook(id: number): Promise<boolean> {
        const { deleted, filePath } = await BookDB.deleteBook(id);
        if (deleted && filePath) {
            const safePath = Helpers.sanitizeFilePath(filePath);
            if (fs.existsSync(safePath)) {
                const hasOther = await BookDB.getOtherBookWithSamePath(filePath, id);
                if (!hasOther) fs.unlinkSync(safePath);
            }
        }
        return deleted;
    },

    async toggleLike(id: number, liked: boolean): Promise<boolean> {
        return await BookDB.toggleLike(id, liked);
    },

    async enumerateGroups(book_id: number): Promise<any[]> {
        return await BookDB.enumerateGroups(book_id);
    },

    async linkGroup(book_id: number, group_id: number): Promise<boolean> {
        return await BookDB.linkGroup(book_id, group_id);
    },

    async unlinkGroup(book_id: number, group_id: number): Promise<boolean> {
        return await BookDB.unlinkGroup(book_id, group_id);
    },

    async getGroupByName(name: string): Promise<number | null> {
        return await BookDB.getGroupByName(name);
    },

    async processBookMetadata(metadata: any, filePath: string): Promise<number> {
        let book_id = 0;
        try {
            const safePath = Helpers.sanitizeFilePath(filePath);
            const existingBook = await BookDB.getBookByFilePath(safePath);
            if (existingBook) {
                return existingBook.id;
            }

            book_id = await BookDB.createBook({
                title: metadata.title,
                description: metadata.annotation || '',
                ai_description: '',
                file_path: safePath,
                liked: false,
                import_key: metadata.import_key,
            });

            for (const author_name of metadata.authors) {
                await BookDB.insertAuthor(author_name);
                const authorId = await BookDB.getAuthorIdByName(author_name);
                if (authorId) await BookDB.linkBookAuthor(book_id, authorId);
            }

            for (const genre_id of metadata.genres) {
                await BookDB.insertGenre(genre_id, genre_id);
                await BookDB.linkBookGenre(book_id, genre_id);
            }

            if (metadata.series?.name) {
                await BookDB.insertSeries(metadata.series.name);
                const seriesId = await BookDB.getSeriesIdByName(metadata.series.name);
                if (seriesId) {
                    await BookDB.linkBookSeries(book_id, seriesId, metadata.series.number ?? null);
                }
            }

            if (metadata.groups && Array.isArray(metadata.groups)) {
                for (const group_name of metadata.groups) {
                    if (typeof group_name !== 'string') continue;
                    const trimmed = group_name.trim();
                    if (trimmed === '') continue;
                    const group_id = await this.getGroupByName(trimmed);
                    if (group_id) await this.linkGroup(book_id, group_id);
                }
            }

        } catch (err) {
            throw err;
        }
        return book_id;
    },
};

export default BookModel; 
