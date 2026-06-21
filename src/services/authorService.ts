import authorModel from '../models/authorModel';
import authorBookModel from '../models/authorBookModel';
import { EnrichedBook, PaginationParams } from '../types/types';

const AuthorService = {
    async getAllAuthors(pagination: PaginationParams): Promise<any[]> {
        return await authorModel.getAllAuthors(pagination);
    },

    async getAllAuthorsCount(): Promise<number> {
        return await authorModel.getAllAuthorsCount();
    },

    async getSearchAuthors(query: string, pagination: PaginationParams): Promise<any[]> {
        return await authorModel.getSearchAuthors(query, pagination);
    },

    async getSearchAuthorsCount(query: string): Promise<number> {
        return await authorModel.getSearchAuthorsCount(query);
    },

    async getAuthorById(id: number): Promise<any> {
        return await authorModel.getAuthorById(id);
    },

    async getAuthorBooks(id: number, pagination: PaginationParams): Promise<EnrichedBook[]> {
        return await authorModel.getAuthorBooks(id, pagination);
    },

    async getAuthorBooksCount(id: number): Promise<number> {
        return await authorModel.getAuthorBooksCount(id);
    },

    async createAuthor(name: string): Promise<number> {
        return await authorModel.createAuthor(name);
    },

    async updateAuthor(id: number, name: string): Promise<boolean> {
        return await authorModel.updateAuthor(id, name);
    },

    async deleteAuthor(id: number): Promise<boolean> {
        return await authorModel.deleteAuthor(id);
    },

    async deleteAuthorBooks(id: number): Promise<boolean> {
        return await authorBookModel.unlinkAllBooks(id);
    },

    async mergeAuthorsService(keepId: number, mergeId: number): Promise<boolean> {
        return await authorModel.mergeAuthors(keepId, mergeId);
    },
};

export default AuthorService;