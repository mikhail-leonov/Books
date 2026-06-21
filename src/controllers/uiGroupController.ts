import GroupService from '../services/groupService';
import Helpers from '../utils/helpers';
import { Request, Response } from 'express';
import { logger } from '../utils/logger';

const UIGroupController = {

    LogPerformance: false,

    async searchGroups(req: Request, res: Response) {
        const start = performance.now();
        const query = req.query.q as string;
        if (!query || query.trim().length === 0) {
            return res.redirect('/groups');
        }
        const totalItems = await GroupService.getSearchGroupsCount(query);
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const groups = await GroupService.getSearchGroups(query, params);
        Helpers.renderTwig('groups', { groups, searchQuery: query, pagination, title: `Search Groups: ${query}` }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIGroupController.LogPerformance) { logger.error(` - - UIGroupController.searchGroups = ${duration}`); }
    },

    async showGroups(req: Request, res: Response) {
        const start = performance.now();
        const totalItems = await GroupService.getAllGroupsCount();
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const groups = await GroupService.getAllGroups(params);
        Helpers.renderTwig('groups', { groups, pagination }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIGroupController.LogPerformance) { logger.error(` - - UIGroupController.showGroups = ${duration}`); }
    },

    async showGroupBooks(req: Request, res: Response) {
        const start = performance.now();
        const id = req.params.id;
        const group = await GroupService.getGroupById(parseInt(id));
        if (!group) return res.status(404).send('Group not found');
        const totalItems = await GroupService.getGroupBooksCount(parseInt(id));
        const { params, pagination } = Helpers.buildPagination(req.url, totalItems);
        const books = await GroupService.getGroupBooks(parseInt(id), params);
        Helpers.renderTwig('entity_books', { entity: group, type: 'Group', books, pagination }, res);
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (UIGroupController.LogPerformance) { logger.error(` - - UIGroupController.showGroupBooks = ${duration}`); }
    },

};

export default UIGroupController;