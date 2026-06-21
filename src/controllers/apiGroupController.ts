import GroupService from '../services/groupService';
import BookService from '../services/bookService';
import Helpers from '../utils/helpers';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

const APIGroupController = {

    LogPerformance: false,

    async getGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const pagination = Helpers.parsePagination(req.query, { sort: 'name', order: 'ASC', limit: 100 });
            Helpers.ok(res, await GroupService.getAllGroups(pagination));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGroupController.LogPerformance) { logger.error(` - - APIGroupController.getGroups = ${duration}`); }
    },

    async getGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid group ID');
            const group = await GroupService.getGroupById(id);
            if (!group) return Helpers.fail(res, 'Group not found', 404);
            Helpers.ok(res, group);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGroupController.LogPerformance) { logger.error(` - - APIGroupController.getGroup = ${duration}`); }
    },

    async postGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const name = req.body.name?.trim();
            if (!name) return Helpers.fail(res, 'Group name is required');
            const id = await GroupService.createGroup(name);
            Helpers.ok(res, await GroupService.getGroupById(id), 201);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGroupController.LogPerformance) { logger.error(` - - APIGroupController.postGroup = ${duration}`); }
    },

    async putGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid group ID');
            const name = req.body.name?.trim();
            if (!name) return Helpers.fail(res, 'Group name is required');
            const updated = await GroupService.updateGroup(id, name);
            if (!updated) return Helpers.fail(res, 'Group not found', 404);
            Helpers.ok(res, await GroupService.getGroupById(id));
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGroupController.LogPerformance) { logger.error(` - - APIGroupController.putGroup = ${duration}`); }
    },
    async removeGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const id = Helpers.parseIntParam(req.params.id);
            if (isNaN(id)) return Helpers.fail(res, 'Invalid group ID');
            const deleted = await GroupService.deleteGroup(id);
            if (!deleted) return Helpers.fail(res, 'Group not found', 404);
            Helpers.ok(res, { message: 'Group deleted' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGroupController.LogPerformance) { logger.error(` - - APIGroupController.removeGroup = ${duration}`); }
    },

    async linkGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const book_id = Helpers.parseIntParam(req.params.id);
            const group_id = Helpers.parseIntParam(req.params.gid);
            if (isNaN(book_id) || isNaN(group_id)) return Helpers.fail(res, 'Invalid book ID or group ID');
            const success = await BookService.linkGroup(book_id, group_id);
            if (!success) return Helpers.fail(res, 'Could not add book to group', 400);
            Helpers.ok(res, { message: 'Book added to group' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGroupController.LogPerformance) { logger.error(` - - APIGroupController.linkGroup = ${duration}`); }
    },

    async enumerateGroups(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const book_id = Helpers.parseIntParam(req.params.id);
            if (isNaN(book_id)) return Helpers.fail(res, 'Invalid book ID');
            const groups = await BookService.enumerateGroups(book_id);
            Helpers.ok(res, { groups });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGroupController.LogPerformance) { logger.error(` - - APIGroupController.enumerateGroups = ${duration}`); }
    },

    async unlinkGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const book_id = Helpers.parseIntParam(req.params.id);
            const group_id = Helpers.parseIntParam(req.params.gid);
            if (isNaN(book_id) || isNaN(group_id)) return Helpers.fail(res, 'Invalid book ID or group ID');
            const success = await BookService.unlinkGroup(book_id, group_id);
            if (!success) return Helpers.fail(res, 'Could not remove book from group', 400);
            Helpers.ok(res, { message: 'Book removed from group' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGroupController.LogPerformance) { logger.error(` - - APIGroupController.unlinkGroup = ${duration}`); }
    },

    async mergeGroup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const keepId = Helpers.parseIntParam(req.body.keep_id);
            const mergeId = Helpers.parseIntParam(req.body.merge_id);
            if (isNaN(keepId) || isNaN(mergeId)) return Helpers.fail(res, 'Invalid group IDs');
            if (keepId === mergeId) return Helpers.fail(res, 'Cannot merge a group with itself');
            await GroupService.mergeGroup(keepId, mergeId);
            Helpers.ok(res, { message: 'Groups merged successfully' });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIGroupController.LogPerformance) { logger.error(` - - APIGroupController.mergeGroup = ${duration}`); }
    },

};

export default APIGroupController;