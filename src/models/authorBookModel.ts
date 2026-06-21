import { AuthorDB } from '../db/authorDB';
import { logger } from '../utils/logger';

const AuthorBookModel = {

    async linkBook(author_id: number, book_id: number): Promise<boolean> {
        return await AuthorDB.linkBook(author_id, book_id);
    },

    async unlinkBook(author_id: number, book_id: number): Promise<boolean> {
        return await AuthorDB.unlinkBook(author_id, book_id);
    },

    async unlinkAllBooks(author_id: number): Promise<boolean> {
        return await AuthorDB.unlinkAllBooks(author_id);
    },
};

export default AuthorBookModel;