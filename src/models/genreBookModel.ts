import GenreDB from '../db/genreDB';

const GenreBookModel = {

    async linkBook(genre_id: string, book_id: number): Promise<boolean> {
        return await GenreDB.linkBook(genre_id, book_id);
    },

    async unlinkBook(genre_id: string, book_id: number): Promise<boolean> {
        return await GenreDB.unlinkBook(genre_id, book_id);
    },

    async unlinkAllBooks(genre_id: string): Promise<boolean> {
        return await GenreDB.unlinkAllBooks(genre_id);
    },
};

export default GenreBookModel;