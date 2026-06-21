import fs from 'fs';
import path from 'path';
import Twig from 'twig';
import { logger } from '../utils/logger';
import { Request, Response } from 'express';
import { PaginationParams, PaginationMeta, Book } from '../types/types';

const Helpers = {
    LogPerformance: false,

    parsePagination(query: Request['query'], defaults: Partial<PaginationParams> = {}): PaginationParams {
        const start = performance.now();
        let result = {
            limit:  parseInt(query.limit as string) || defaults.limit || 50,
            offset: parseInt(query.offset as string) || defaults.offset || 0,
            sort:   (query.sort as string) || defaults.sort || 'created_at',
            order:  (query.order as string) || defaults.order || 'ASC',
        };
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - Helpers.parsePagination = ${duration}`); }
        return result;
    },

    parseIntParam(value: string | undefined): number {
        return value ? parseInt(value, 10) : NaN;
    },

    ok(res: Response, data: unknown, status = 200): void {
        res.status(status).json({ success: true, data });
    },

    fail(res: Response, message: string, status = 400): void {
        res.status(status).json({ success: false, error: message });
    },

    renderTwig(view: string, data: any, res: Response): void {
        Twig.renderFile(`src/views/${view}.twig`, data, (err, html) => {
            if (err) {
                logger.error(err);
                res.status(500).send('Template error');
            } else {
                res.send(html);
            }
        });
    },

    buildPagination(urlOrQuery: string, totalItems: number = 0): { params: PaginationParams; pagination: PaginationMeta } {
        const start = performance.now();
        const queryString = urlOrQuery.includes('?') ? urlOrQuery.split('?')[1] : urlOrQuery;
        const query = new URLSearchParams(queryString);
        const defaultLimit = 100;
        const limit = Number(Math.max(1, Math.min(100, parseInt(query.get('limit') || '', 10) || defaultLimit)));
        const pageInput = parseInt(query.get('page') || '1', 10);
        const page = Number(Math.max(1, pageInput));
        const offset = Number((page - 1) * limit);
        const allowedSortFields = ['id', 'title', 'name', 'created_at'];
        const rawSort = query.get('sort') || 'id';
        const sort = allowedSortFields.includes(rawSort) ? rawSort : 'id';
        const order = (query.get('order')?.toLowerCase() === 'asc') ? 'asc' : 'desc';
        const totalPages = totalItems > 0 ? Math.ceil(totalItems / limit) : 1;
        const params: PaginationParams = { page, offset, limit, sort, order };
        const pagination: PaginationMeta = {
            currentPage: page,
            totalPages,
            itemsPerPage: limit,
            totalItems,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
            nextPage: page < totalPages ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null,
        };
        const result = { params, pagination };
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - Helpers.buildPagination = ${duration}`); }
        return result;
    },

    validatePagination(pagination: PaginationParams): void {
        const start = performance.now();
        const ALLOWED_SORT_COLUMNS = ['id', 'title', 'liked', 'created_at', 'year', 'publisher', 'name'];
        const ALLOWED_ORDER_DIRECTIONS = ['asc', 'desc'];
        if (!pagination.sort || !ALLOWED_SORT_COLUMNS.includes(pagination.sort)) {
            pagination.sort = 'id';
        }
        const order = pagination.order?.toLowerCase();
        pagination.order = ALLOWED_ORDER_DIRECTIONS.includes(order as string) ? (order as 'asc' | 'desc') : 'desc';
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - Helpers.validatePagination = ${duration}`); }
    },

    sanitizeFilePath(filePath: string): string {
        const start = performance.now();
        if (!filePath) return '';
        const normalized = path.normalize(filePath);
        if (normalized.includes('..') || path.isAbsolute(normalized) && !normalized.startsWith(process.cwd())) {
            throw new Error('Invalid file path');
        }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - Helpers.sanitizeFilePath = ${duration}`); }
        return normalized;
    },

    validateBookData(data: Partial<Book>): string | null {
        const start = performance.now();
        let result: string | null = null;
        if (data.title !== undefined && (typeof data.title !== 'string' || data.title.trim() === '')) result = 'Title must be a non-empty string';
        else if (data.description !== undefined && typeof data.description !== 'string') result = 'Description must be a string';
        else if (data.ai_description !== undefined && typeof data.ai_description !== 'string') result = 'AI Description must be a string';
        else if (data.liked !== undefined && typeof data.liked !== 'boolean' && data.liked !== 0 && data.liked !== 1) result = 'Liked must be boolean or 0/1';
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - Helpers.validateBookData = ${duration}`); }
        return result;
    },

    toBooleanQuery(raw: string): string {
        const terms = raw.replace(/[+\-><()~*"@]/g, ' ').split(/\s+/).filter((t) => t.length > 0);
	if (terms.length === 0) { return '' };
        return terms.map((t) => `+${t}*`).join(' ');
    },

};

export default Helpers;