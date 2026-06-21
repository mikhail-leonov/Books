import AuthorService from '../services/authorService';
import GenreService  from '../services/genreService';
import GroupService  from '../services/groupService';
import SerieService  from '../services/seriesService';
import Helpers from '../utils/helpers';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

type EntityType = 'authors' | 'genres' | 'groups' | 'series';

const VALID_TYPES: EntityType[] = ['authors', 'genres', 'groups', 'series'];

function isValidType(t: string): t is EntityType {
    return (VALID_TYPES as string[]).includes(t);
}

async function searchByType(type: EntityType, query: string, pagination: any): Promise<any[]> {
    switch (type) {
        case 'authors': return AuthorService.getSearchAuthors(query, pagination);
        case 'genres':  return GenreService.getSearchGenres(query, pagination);
        case 'groups':  return GroupService.getSearchGroups(query, pagination);
        case 'series':  return SerieService.getSearchSeries(query, pagination);
    }
}

// Reuses the exact same service-layer merge functions the per-entity endpoints use.
async function mergePairByType(type: EntityType, keepId: string, mergeId: string): Promise<void> {
    switch (type) {
        case 'authors': await AuthorService.mergeAuthorsService(Number(keepId), Number(mergeId)); break;
        case 'genres':  await GenreService.mergeGenreService(keepId as any, mergeId as any); break; // genre ids are strings
        case 'groups':  await GroupService.mergeGroup(Number(keepId), Number(mergeId)); break;
        case 'series':  await SerieService.mergeSerieService(Number(keepId), Number(mergeId)); break;
    }
}

const APIMergeController = {

    LogPerformance: false,

    // GET /api/merge/:type/search?q=...   -> { success, data: [{ id, name }] }
    async search(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const type = req.params.type;
            if (!isValidType(type)) return Helpers.fail(res, 'Invalid entity type');

            const q = (req.query.q as string)?.trim();
            if (!q) return Helpers.ok(res, []);

            const pagination = Helpers.parsePagination(req.query, { sort: 'name', order: 'ASC', limit: 100 });
            const items = await searchByType(type, q, pagination);
            const data = (items || []).map((it: any) => ({ id: it.id, name: it.name }));
            Helpers.ok(res, data);
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIMergeController.LogPerformance) { logger.error(` - - APIMergeController.search = ${duration}`); }
    },

    // POST /api/merge/:type   body: { ids: [keepId, mergeId, mergeId, ...] }
    // Keeps the first id and merges every other one into it, sequentially.
    async merge(req: Request, res: Response, next: NextFunction): Promise<void> {
        const start = performance.now();
        try {
            const type = req.params.type;
            if (!isValidType(type)) return Helpers.fail(res, 'Invalid entity type');

            const rawIds = Array.isArray(req.body.ids) ? req.body.ids : [];
            const ids: string[] = [];
            for (const raw of rawIds) {
                const v = String(raw).trim();
                if (v && !ids.includes(v)) ids.push(v); // de-dupe, preserve order
            }
            if (ids.length < 2) return Helpers.fail(res, 'Select at least two distinct items to merge');

            // Numeric entities must have valid numeric ids (genres use string ids).
            if (type !== 'genres') {
                for (const v of ids) {
                    if (isNaN(Number(v))) return Helpers.fail(res, `Invalid ${type} id: ${v}`);
                }
            }

            const keepId = ids[0];
            const mergeIds = ids.slice(1);
            for (const mergeId of mergeIds) {
                if (mergeId === keepId) continue;
                await mergePairByType(type, keepId, mergeId);
            }

            Helpers.ok(res, {
                keep_id: keepId,
                merged_ids: mergeIds,
                merged_count: mergeIds.length,
                message: `Merged ${mergeIds.length} item(s) into ${keepId}`,
            });
        } catch (err) { next(err); }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (APIMergeController.LogPerformance) { logger.error(` - - APIMergeController.merge = ${duration}`); }
    },

};

export default APIMergeController;
