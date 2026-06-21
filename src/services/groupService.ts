import groupModel from '../models/groupModel';
import groupBookModel from '../models/groupBookModel';
import { EnrichedBook, PaginationParams } from '../types/types';

const GroupService = {
    async getAllGroups(pagination: PaginationParams): Promise<any[]> {
        return await groupModel.getAllGroups(pagination);
    },

    async getAllGroupsEx(): Promise<any[]> {
        return await groupModel.getAllGroups({ limit: 10000, offset: 0, sort: 'name', order: 'ASC' });
    },

    async getAllGroupsCount(): Promise<number> {
        return await groupModel.getAllGroupsCount();
    },

    async getSearchGroups(query: string, pagination: PaginationParams): Promise<any[]> {
        return await groupModel.getSearchGroups(query, pagination);
    },

    async getSearchGroupsCount(query: string): Promise<number> {
        return await groupModel.getSearchGroupsCount(query);
    },

    async getGroupById(id: number): Promise<any> {
        return await groupModel.getGroupById(id);
    },

    async getGroupBooks(id: number, pagination: PaginationParams): Promise<EnrichedBook[]> {
        return await groupModel.getGroupBooks(id, pagination);
    },

    async getGroupBooksCount(id: number): Promise<number> {
        return await groupModel.getGroupBooksCount(id);
    },

    async createGroup(name: string): Promise<number> {
        return await groupModel.createGroup(name);
    },

    async updateGroup(id: number, name: string): Promise<boolean> {
        return await groupModel.updateGroup(id, name);
    },

    async deleteGroup(id: number): Promise<boolean> {
        return await groupModel.deleteGroup(id);
    },

    async deleteGroupBooks(id: number): Promise<boolean> {
        return await groupBookModel.unlinkAllBooks(id);
    },

    async mergeGroup(keepId: number, mergeId: number): Promise<boolean> {
        return await groupModel.mergeGroups(keepId, mergeId);
    },
};

export default GroupService;