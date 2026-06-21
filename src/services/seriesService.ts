import serieModel from '../models/serieModel';
import serieBookModel from '../models/serieBookModel';
import { EnrichedBook, PaginationParams } from '../types/types';

const SerieService = {
    async getAllSeries(pagination: PaginationParams): Promise<any[]> {
        return await serieModel.getAllSeries(pagination);
    },

    async getAllSeriesCount(): Promise<number> {
        return await serieModel.getAllSeriesCount();
    },

    async getSearchSeries(query: string, pagination: PaginationParams): Promise<any[]> {
        return await serieModel.getSearchSeries(query, pagination);
    },

    async getSearchSeriesCount(query: string): Promise<number> {
        return await serieModel.getSearchSeriesCount(query);
    },

    async getSerieById(id: number): Promise<any> {
        return await serieModel.getSerieById(id);
    },

    async getSerieBooks(id: number, pagination: PaginationParams): Promise<EnrichedBook[]> {
        return await serieModel.getSerieBooks(id, pagination);
    },

    async getSerieBooksCount(id: number): Promise<number> {
        return await serieModel.getSerieBooksCount(id);
    },

    async createSerie(name: string): Promise<number> {
        return await serieModel.createSerie(name);
    },

    async updateSerie(id: number, name: string): Promise<boolean> {
        return await serieModel.updateSerie(id, name);
    },

    async deleteSerie(id: number): Promise<boolean> {
        return await serieModel.deleteSerie(id);
    },

    async deleteSerieBooks(id: number): Promise<boolean> {
        return await serieBookModel.unlinkAllBooks(id);
    },

    async mergeSerieService(keepId: number, mergeId: number): Promise<boolean> {
        return await serieModel.mergeSeries(keepId, mergeId);
    },
};

export default SerieService;