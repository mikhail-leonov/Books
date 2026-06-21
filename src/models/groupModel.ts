import GroupDB from '../db/groupDB';
import { EnrichedBook, PaginationParams } from '../types/types';
import Enricher from '../utils/enricher';
import Helpers from '../utils/helpers';

const GroupModel = {

    async getAllGroups(pagination: PaginationParams): Promise<any[]> {
        return await GroupDB.getAllGroups(pagination);
    },

    async getAllGroupsCount(): Promise<number> {
        return await GroupDB.getAllGroupsCount();
    },

    async getSearchGroups(query: string, pagination: PaginationParams): Promise<any[]> {
        return await GroupDB.getSearchGroups(query, pagination);
    },

    async getSearchGroupsCount(query: string): Promise<number> {
        return await GroupDB.getSearchGroupsCount(query);
    },

    async getGroupById(id: number): Promise<any> {
        return await GroupDB.getGroupById(id);
    },

    async getGroupBooks(id: number, pagination: PaginationParams): Promise<EnrichedBook[]> {
        Helpers.validatePagination(pagination);
        const books = await GroupDB.getGroupBooksRaw(id, pagination);
        return await Enricher.enrich(books);
    },

    async getGroupBooksCount(id: number): Promise<number> {
        return await GroupDB.getGroupBooksCount(id);
    },

    async createGroup(name: string): Promise<number> {
        return await GroupDB.createGroup(name);
    },

    async updateGroup(id: number, name: string): Promise<boolean> {
        return await GroupDB.updateGroup(id, name);
    },

    async deleteGroup(id: number): Promise<boolean> {
        return await GroupDB.deleteGroup(id);
    },

    async deleteGroupBooks(id: number): Promise<boolean> {
        return await GroupDB.deleteGroupBooks(id);
    },

    async mergeGroups(keepId: number, mergeId: number): Promise<void> {
        return await GroupDB.mergeGroups(keepId, mergeId);
    },
};

export default GroupModel;