import genreModel from '../models/genreModel';
import genreBookModel from '../models/genreBookModel';
import { EnrichedBook, PaginationParams } from '../types/types';

const GenreService = {
    async getAllGenres(pagination: PaginationParams): Promise<any[]> {
        return await genreModel.getAllGenres(pagination);
    },

    async getAllGenresCount(): Promise<number> {
        return await genreModel.getAllGenresCount();
    },

    async getSearchGenres(query: string, pagination: PaginationParams): Promise<any[]> {
        return await genreModel.getSearchGenres(query, pagination);
    },

    async getSearchGenresCount(query: string): Promise<number> {
        return await genreModel.getSearchGenresCount(query);
    },

    async getGenreById(id: string): Promise<any> {
        return await genreModel.getGenreById(id);
    },

    async getGenreBooks(id: string, pagination: PaginationParams): Promise<EnrichedBook[]> {
        return await genreModel.getGenreBooks(id, pagination);
    },

    async getGenreBooksCount(id: string): Promise<number> {
        return await genreModel.getGenreBooksCount(id);
    },

    async createGenre(id: string, name: string): Promise<boolean> {
        return await genreModel.createGenre(id, name);
    },

    async updateGenre(id: string, name: string): Promise<boolean> {
        return await genreModel.updateGenre(id, name);
    },

    async deleteGenre(id: string): Promise<boolean> {
        return await genreModel.deleteGenre(id);
    },

    async deleteGenreBooks(id: string): Promise<boolean> {
        return await genreBookModel.unlinkAllBooks(id);
    },

    async mergeGenreService(keepId: number, mergeId: number): Promise<boolean> {
        return await genreModel.mergeGenres(keepId, mergeId);
    },
};

export default GenreService;