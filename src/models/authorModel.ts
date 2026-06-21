import AuthorDB from '../db/authorDB';
import { EnrichedBook, PaginationParams } from '../types/types';
import Enricher from '../utils/enricher';
import Helpers from '../utils/helpers';

const AuthorModel = {

    async getAllAuthors(pagination: PaginationParams): Promise<Author[]> {
        return await AuthorDB.getAllAuthors(pagination);
    },

    async getAllAuthorsCount(): Promise<number> {
        return await AuthorDB.getAllAuthorsCount();
    },

    async getSearchAuthors(query: string, pagination: PaginationParams): Promise<Author[]> {
        return await AuthorDB.getSearchAuthors(query, pagination);
    },

    async getSearchAuthorsCount(query: string): Promise<number> {
        return await AuthorDB.getSearchAuthorsCount(query);
    },

    async getAuthorById(id: number): Promise<Author | null> {
        return await AuthorDB.getAuthorById(id);
    },

    async getAuthorBooks(id: number, pagination: PaginationParams): Promise<EnrichedBook[]> {
        Helpers.validatePagination(pagination);
        const books = await AuthorDB.getAuthorBooksRaw(id, pagination);
        return await Enricher.enrich(books);
    },

    async getAuthorBooksCount(id: number): Promise<number> {
        return await AuthorDB.getAuthorBooksCount(id);
    },

    async createAuthor(name: string): Promise<number> {
        return await AuthorDB.createAuthor(name);
    },

    async updateAuthor(id: number, name: string): Promise<boolean> {
        return await AuthorDB.updateAuthor(id, name);
    },

    async deleteAuthor(id: number): Promise<boolean> {
        return await AuthorDB.deleteAuthor(id);
    },

    async mergeAuthors(keepId: number, mergeId: number): Promise<void> {
        return await AuthorDB.mergeAuthors(keepId, mergeId);
    },
};

export default AuthorModel;