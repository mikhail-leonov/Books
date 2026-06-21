import SerieDB from '../db/serieDB';
import { EnrichedBook, PaginationParams } from '../types/types';
import Enricher from '../utils/enricher';
import Helpers from '../utils/helpers';

const SerieModel = {

    async getAllSeries(pagination: PaginationParams): Promise<any[]> {
        return await SerieDB.getAllSeries(pagination);
    },

    async getAllSeriesCount(): Promise<number> {
        return await SerieDB.getAllSeriesCount();
    },

    async getSearchSeries(query: string, pagination: PaginationParams): Promise<any[]> {
        return await SerieDB.getSearchSeries(query, pagination);
    },

    async getSearchSeriesCount(query: string): Promise<number> {
        return await SerieDB.getSearchSeriesCount(query);
    },

    async getSerieById(id: number): Promise<any> {
        return await SerieDB.getSerieById(id);
    },

    async getSerieBooks(id: number, pagination: PaginationParams): Promise<EnrichedBook[]> {
        Helpers.validatePagination(pagination);
        const books = await SerieDB.getSerieBooksRaw(id, pagination);
        return await Enricher.enrich(books);
    },

    async getSerieBooksCount(id: number): Promise<number> {
        return await SerieDB.getSerieBooksCount(id);
    },

    async createSerie(name: string): Promise<number> {
        return await SerieDB.createSerie(name);
    },

    async updateSerie(id: number, name: string): Promise<boolean> {
        return await SerieDB.updateSerie(id, name);
    },

    async deleteSerie(id: number): Promise<boolean> {
        return await SerieDB.deleteSerie(id);
    },

    async deleteSerieBooks(id: number): Promise<boolean> {
        return await SerieDB.deleteSerieBooks(id);
    },

    async mergeSeries(keepId: number, mergeId: number): Promise<void> {
        return await SerieDB.mergeSeries(keepId, mergeId);
    },
};

export default SerieModel;