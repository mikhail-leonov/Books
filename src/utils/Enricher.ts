import { Book, Author, Genre, Series, EnrichedBook, AuthorRow, GenreRow, SeriesRow } from '../types/types';
import { getDb } from '../db/index';
import { logger } from '../utils/logger';

const Enricher = {
    LogPerformance: false,

    async enrich(books: Book[]): Promise<EnrichedBook[]> {
        const start = performance.now();
        const db = getDb();
        if (!books || books.length === 0) { return []; }
        const bookIds = books.map(b => b.id);
        const placeholders = bookIds.map(() => '?').join(',');
        const authorsSql = `SELECT ba.book_id, a.id, a.name FROM book_authors ba JOIN authors a ON ba.author_id = a.id WHERE ba.book_id IN (${placeholders})`;
        const genresSql = `SELECT bg.book_id, g.id, g.name FROM book_genres bg JOIN genres g ON bg.genre_id = g.id WHERE bg.book_id IN (${placeholders})`;
        const seriesSql = `SELECT bs.book_id, s.id, s.name, bs.serie_order FROM book_series bs JOIN series s ON bs.serie_id = s.id WHERE bs.book_id IN (${placeholders})`;

        const [authorsRows, genresRows, seriesRows] = await Promise.all([
            db.query(authorsSql, bookIds) as Promise<AuthorRow[]>,
            db.query(genresSql, bookIds) as Promise<GenreRow[]>,
            db.query(seriesSql, bookIds) as Promise<SeriesRow[]>,
        ]);

        const authorsMap = new Map<number, Author[]>();
        const genresMap = new Map<number, Genre[]>();
        const seriesMap = new Map<number, Series[]>();

        authorsRows.forEach(row => { if (!authorsMap.has(row.book_id)) { authorsMap.set(row.book_id, []); } 
            authorsMap.get(row.book_id)!.push({ id: row.id, name: row.name, });
        });
        genresRows.forEach(row => { if (!genresMap.has(row.book_id)) { genresMap.set(row.book_id, []); }
            genresMap.get(row.book_id)!.push({id: row.id, name: row.name, });
        });
        seriesRows.forEach(row => { if (!seriesMap.has(row.book_id)) { seriesMap.set(row.book_id, []); }
            seriesMap.get(row.book_id)!.push({ id: row.id, name: row.name, order: row.serie_order, });
        });
        const result: EnrichedBook[] = books.map(book => ({
            ...book,
            authors: authorsMap.get(book.id) || [],
            genres: genresMap.get(book.id) || [],
            series: seriesMap.get(book.id) || [],
        }));

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - Enricher.enrich = ${duration}`); }
        return result;
    },
};

export default Enricher;