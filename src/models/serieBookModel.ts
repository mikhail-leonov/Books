import SerieDB from '../db/serieDB';

const SerieBookModel = {

    async linkBook(serie_id: number, book_id: number, series_order: number): Promise<boolean> {
        return await SerieDB.linkBook(serie_id, book_id, series_order);
    },

    async unlinkBook(serie_id: number, book_id: number): Promise<boolean> {
        return await SerieDB.unlinkBook(serie_id, book_id);
    },

    async unlinkAllBooks(serie_id: number): Promise<boolean> {
        return await SerieDB.unlinkAllBooks(serie_id);
    },
};

export default SerieBookModel;