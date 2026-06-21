import GenreDB from '../db/genreDB';
import { EnrichedBook, PaginationParams } from '../types/types';
import Enricher from '../utils/enricher';
import Helpers from '../utils/helpers';

const GenreModel = {

    async getAllGenres(pagination: PaginationParams): Promise<any[]> {
        return await GenreDB.getAllGenres(pagination);
    },

    async getAllGenresCount(): Promise<number> {
        return await GenreDB.getAllGenresCount();
    },

    async getSearchGenres(query: string, pagination: PaginationParams): Promise<any[]> {
        return await GenreDB.getSearchGenres(query, pagination);
    },

    async getSearchGenresCount(query: string): Promise<number> {
        return await GenreDB.getSearchGenresCount(query);
    },

    async getGenreById(id: string): Promise<any> {
        return await GenreDB.getGenreById(id);
    },

    async getGenreBooks(id: string, pagination: PaginationParams): Promise<EnrichedBook[]> {
        Helpers.validatePagination(pagination);
        const books = await GenreDB.getGenreBooksRaw(id, pagination);
        return await Enricher.enrich(books);
    },

    async getGenreBooksCount(id: string): Promise<number> {
        return await GenreDB.getGenreBooksCount(id);
    },

    async createGenre(id: string, name: string): Promise<boolean> {
        return await GenreDB.createGenre(id, name);
    },

    async updateGenre(id: string, name: string): Promise<boolean> {
        return await GenreDB.updateGenre(id, name);
    },

    async deleteGenre(id: string): Promise<boolean> {
        return await GenreDB.deleteGenre(id);
    },

    async deleteGenreBooks(id: string): Promise<boolean> {
        return await GenreDB.deleteGenreBooks(id);
    },

    async mergeGenres(keepId: string, mergeId: string): Promise<void> {
        return await GenreDB.mergeGenres(keepId, mergeId);
    },
};

export default GenreModel;