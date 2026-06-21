import bookModel from '../models/bookModel';
import { EnrichedBook, PaginationParams, FileContent, Book } from '../types/types';
import { generateText } from '../utils/ollamaClient';
import { extractChapters } from '../utils/fb2';
import { logger } from '../utils/logger';

const BookService = {
    async getAllBooks(pagination: PaginationParams): Promise<EnrichedBook[]> {
        return await bookModel.getAllBooks(pagination);
    },

    async getAllBooksCount(): Promise<number> {
        return await bookModel.getAllBooksCount();
    },

    async getAllLikedBooks(pagination: PaginationParams): Promise<EnrichedBook[]> {
        return await bookModel.getAllLikedBooks(pagination);
    },

    async getAllLikedBooksCount(): Promise<number> {
        return await bookModel.getAllLikedBooksCount();
    },

    async getAllRecentBooks(pagination: PaginationParams): Promise<EnrichedBook[]> {
        return await bookModel.getAllRecentBooks(pagination);
    },

    async getAllRecentBooksCount(): Promise<number> {
        return await bookModel.getAllRecentBooksCount();
    },

    async getSearchBooks(query: string, pagination: PaginationParams): Promise<EnrichedBook[]> {
        return await bookModel.getSearchBooks(query, pagination);
    },

    async getSearchBooksCount(query: string): Promise<number> {
        return await bookModel.getSearchBooksCount(query);
    },

    async getBookById(id: number): Promise<any> {
        return await bookModel.getBookById(id);
    },

    async getBookContentById(id: number): Promise<FileContent> {
        return await bookModel.getBookContentById(id);
    },

    async createBook(data: Partial<Book>): Promise<number> {
        return await bookModel.createBook(data);
    },

    async updateBook(id: number, updates: Partial<Book>): Promise<boolean> {
        return await bookModel.updateBook(id, updates);
    },

    async deleteBook(id: number): Promise<boolean> {
        return await bookModel.deleteBook(id);
    },

    async toggleLike(id: number, liked: boolean): Promise<boolean> {
        return await bookModel.toggleLike(id, liked);
    },

    async processBookMetadata(metadata: any, filePath: string): Promise<number> {
        return await bookModel.processBookMetadata(metadata, filePath);
    },

    async linkGroup(book_id: number, group_id: number): Promise<boolean> {
        return await bookModel.linkGroup(book_id, group_id);
    },

    async unlinkGroup(book_id: number, group_id: number): Promise<boolean> {
        return await bookModel.unlinkGroup(book_id, group_id);
    },

    async enumerateGroups(book_id: number): Promise<any[]> {
        return await bookModel.enumerateGroups(book_id);
    },

    // Caps to keep the LLM workload bounded and within the model context window.
    MAX_CHAPTERS: 40,
    MAX_CHARS_PER_CHAPTER: 4000,
    MAX_COMBINED_CHARS: 12000,

    async generateAIDescription(bookId: number): Promise<string> {

        logger.error(` - - BookService.generateAIDescription`);

        const book = await this.getBookById(bookId);
        if (!book || !book.file_path) throw new Error('Book file not found');

        const chapters = await extractChapters(book.file_path);
        if (chapters.length === 0) throw new Error('No chapters found in FB2 file');

        const limitedChapters = chapters.slice(0, this.MAX_CHAPTERS);

        const chapterSummaries: string[] = [];
        for (let i = 0; i < limitedChapters.length; i++) {
            const chapterText = limitedChapters[i].slice(0, this.MAX_CHARS_PER_CHAPTER).trim();
            if (!chapterText) continue;
            const prompt = `Ты – литературный критик. Пожалуйста, напиши краткое содержание следующей главы книги (2-3 абзаца) на русском языке.\n\nГлава ${i + 1}:\n${chapterText}`;
            const summary = await generateText(prompt);
            if (summary && summary.trim()) {
                chapterSummaries.push(`Глава ${i + 1}: ${summary.trim()}`);
            }
        }
        if (chapterSummaries.length === 0) {
            throw new Error('Failed to generate any chapter summaries');
        }
        let combinedSummaries = chapterSummaries.join('\n\n');
        if (combinedSummaries.length > this.MAX_COMBINED_CHARS) {
            combinedSummaries = combinedSummaries.slice(0, this.MAX_COMBINED_CHARS);
        }
        const finalPrompt = `Ты – литературный критик. На основе кратких содержаний всех глав книги, напиши общее описание всей книги (2-3 абзаца) на русском языке. Описание должно передавать сюжет, ключевые темы и атмосферу.\n\n${combinedSummaries}`;
        const finalDescription = (await generateText(finalPrompt)).trim();
        if (!finalDescription) throw new Error('AI returned an empty description');
        const saved = await bookModel.updateAIDescription(bookId, finalDescription);
        if (!saved) throw new Error('Failed to persist AI description');
        return finalDescription;
    },

};

export default BookService; 
