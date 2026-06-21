import GroupDB from '../db/groupDB';

const GroupBookModel = {

    async linkBook(group_id: number, book_id: number): Promise<boolean> {
        return await GroupDB.linkBook(group_id, book_id);
    },

    async unlinkBook(group_id: number, book_id: number): Promise<boolean> {
        return await GroupDB.unlinkBook(group_id, book_id);
    },

    async unlinkAllBooks(group_id: number): Promise<boolean> {
        return await GroupDB.unlinkAllBooks(group_id);
    },
};

export default GroupBookModel;