/**
 * Type definitions for the book library database
 */
// Base entity types
export interface Author {
    id: number;
    name: string;
}

export interface Genre {
    id: string;  
    name: string;
}

export interface Series {
    id: number;
    name: string;
    order: number | null;
}

export interface Group {
    id: string;  
    name: string;
}

// Book record from database
export interface Book {
    id: number;
    title: string;
    description: string | null;
    ai_description: string;
    file_path: string;
    liked: number;  // SQLite boolean (0 or 1)
    created_at: string;  // ISO timestamp string
    import_key?: string; 
}

export interface EnrichedBook extends Book {
    authors: { id: number; name: string }[];
    genres: { id: string; name: string }[];
    series: { id: number; name: string }[];
}

// Database row types for joins
export interface AuthorRow {
    book_id: number;
    id: number;
    name: string;
}

export interface GenreRow {
    book_id: number;
    id: string;
    name: string;
}

export interface GroupRow {
    book_id: number;
    id: string;
    name: string;
}

export interface SeriesRow {
    book_id: number;
    id: number;
    name: string;
    serie_order: number | null;
}

export interface PaginationParams {
    page?: number;
    sort: string;
    limit: number;
    offset: number;
    order: 'asc' | 'desc';
}

// Paginated response
export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: PaginationMeta;
}

export interface FilterResult {
    skip: boolean;
    code: number;
    reason: string;
}

export interface FilterConfig {
    allowedLanguages?: string[];
    blockedLanguages?: string[];
    allowedEncodings?: string[];
    blockedEncodings?: string[];
    allowedGenres?: string[];
    blockedGenres?: string[];
    blockedAuthors?: string[];
    skipDuplicates?: boolean;
}

export type FileContent = {
    content: string | null;
    filePath: string | null;
};

