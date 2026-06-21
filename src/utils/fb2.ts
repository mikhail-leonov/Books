import fs from 'fs';
import jschardet from 'jschardet';
import iconv from 'iconv-lite';
import crypto from 'crypto';

import { logger } from '../utils/logger';
import { FilterResult } from '../types/types';
import { XMLParser } from 'fast-xml-parser'
import { parseStringPromise } from 'xml2js';
import { ALLOWED_GENRES } from '../config/allowedGenres';
import { ALLOWED_ENCODINGS } from '../config/allowedEncodings';
import { ALLOWED_LANGUAGES } from '../config/allowedLanguages';

const DEFAULT_LANGUAGE =  'en';

const extractText = (node: any): string => {
    if (node == null) { return ''; }
    if (!node) { return ''; }
    if (typeof node === 'object') { return node['#text'] ?? ''; }
    return String(node);
};

export const fb2 = {

    LogPerformance: false,

    config: {
        allowedLanguages: ALLOWED_LANGUAGES,
        blockedLanguages: [],
        allowedEncodings: ALLOWED_ENCODINGS,
        blockedEncodings: [],
        allowedGenres: ALLOWED_GENRES,
        blockedGenres: [],
        blockedAuthors: [],
        skipDuplicates: true
    },

    shouldNotSkip() {
        return { skip: false, code: 0, reason: 'OK' };
    },
    shouldSkipDuplicate() {
        return { skip: true, code: 1, reason: 'Duplicate book' };
    },
    
    shouldSkipZeroFile(filePath) {
        const start = performance.now();

        let result = this.shouldNotSkip();
        try {
            const stats = fs.statSync(filePath);
            if (stats.size === 0) {
                result = { skip: true, code: 12, reason: 'File size is zero' };
            }
        } catch (err) {
            result = { skip: true, code: 11, reason: `File stat error: ${err.message}` };
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.shouldSkipZeroFile = ${duration}`); }
        return result;
    },

    shouldSkipLanguage(metadata) {
        const start = performance.now();
        let result = this.shouldNotSkip();

        const language = this.extractLanguage(metadata);
        if (language) {
            if (this.config.blockedLanguages && this.config.blockedLanguages.length > 0) {
                if (this.config.blockedLanguages.includes(language.toLowerCase())) {
                    result = { skip: true, code: 3, reason: `${language} blocked` };
                }
            }
            if (this.config.allowedLanguages && this.config.allowedLanguages.length > 0) {
                if (!this.config.allowedLanguages.includes(language.toLowerCase())) {
                    result = { skip: true, code: 2, reason: `${language} blocked` };
                }
            }
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.shouldSkipLanguage = ${duration}`); }
        return result;
    },

    shouldSkipEncoding(encoding) {
        const start = performance.now();
        let result = this.shouldNotSkip();

        if (encoding) {
            if (this.config.blockedEncodings && this.config.blockedEncodings.length > 0) {
                if (this.config.blockedEncodings.includes(encoding)) {
                    return { skip: true, code: 5, reason: `${encoding} blocked` };
                }
            }
            if (this.config.allowedEncodings && this.config.allowedEncodings.length > 0) {
                if (!this.config.allowedEncodings.includes(encoding)) {
                    result = { skip: true, code: 4, reason: `${encoding} blocked` };
                }
            }
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.shouldSkipEncoding = ${duration}`); }
        return result;
    },

    shouldSkipGenres(metadata) {
        const start = performance.now();
        let result = this.shouldNotSkip();

        if (metadata.genres && metadata.genres.length > 0) {
            if (this.config.blockedGenres && this.config.blockedGenres.length > 0) {
                for (const genre of metadata.genres) {
                    if (this.config.blockedGenres.includes(genre.toLowerCase())) {
                        result = { skip: true, code: 6, reason: `Genre blocked` };
                    }
                }
            }
            if (this.config.allowedGenres && this.config.allowedGenres.length > 0) {
                let hasAllowedGenre = false;
                for (const genre of metadata.genres) {
                    if (this.config.allowedGenres.includes(genre.toLowerCase())) {
                        hasAllowedGenre = true;
                        break;
                    }
                }
                if (!hasAllowedGenre) {
                    result = { skip: true, code: 7, reason: `Genre blocked` };
                }
            }
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.shouldSkipGenres = ${duration}`); }
        return result;
    },

    shouldSkipAuthor(metadata) {
        const start = performance.now();
        let result = this.shouldNotSkip();

        if (metadata.authors && metadata.authors.length > 0 && this.config.blockedAuthors && this.config.blockedAuthors.length > 0) {
            for (const author of metadata.authors) {
                const authorLower = author.toLowerCase();
                if (this.config.blockedAuthors.some(blocked => authorLower.includes(blocked.toLowerCase()))) {
                    result = { skip: true, code: 8, reason: `Author blocked` };
                }
            }
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.shouldSkipAuthor = ${duration}`); }
        return result;
    },

    shouldSkipEncodingMismatch(encoding, filePath) {
        const start = performance.now();
        let result = this.shouldNotSkip();
        // Only check if both encoding and filePath are provided
        if (encoding && filePath) {
            try {
                const buffer = fs.readFileSync(filePath);
                const detected = jschardet.detect(buffer);
                if (detected && detected.encoding) {
                    const realEncoding = this.mapEncoding(detected.encoding.toLowerCase());
                    if (realEncoding !== encoding) {
                        result = { skip: true, code: 13, reason: `Mismatch ${encoding} vs ${realEncoding} (confidence: ${detected.confidence})` };
                    }
                }
            } catch (err) {
                // If file cannot be read, do not skip; just log or ignore
                // Alternatively, you could return a skip result, but better to not block on read errors here
            }
        }
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.shouldSkipEncodingMismatch = ${duration}`); }
        return result;
    },

    shouldSkip(metadata: any, filePath: string, encoding?: string, isDuplicate?: boolean): FilterResult {
        const start = performance.now();

        let result = this.shouldNotSkip();
        if (encoding) { encoding = this.mapEncoding(encoding.toLowerCase()); } else { encoding = 'utf-8'; }
        if (this.config.skipDuplicates && isDuplicate) { result = this.shouldSkipDuplicate(); }
	if (!result.skip) { result = this.shouldSkipZeroFile(filePath); }
	if (!result.skip) { result = this.shouldSkipLanguage(metadata); }
	if (!result.skip) { result = this.shouldSkipEncoding(encoding); }
	if (!result.skip) { result = this.shouldSkipGenres(metadata); }
	if (!result.skip) { result = this.shouldSkipAuthor(metadata); }
	if (!result.skip) { result = this.shouldSkipEncodingMismatch(encoding, filePath); }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.shouldSkip = ${duration}`); }

        return result;
    },
    
    extractLanguage(metadata: any): string | null {
        const start = performance.now();

        let result = null;
        if (metadata.language) {
            result = metadata.language;
        }
        if (metadata.lang) {
            result = metadata.lang;
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.extractLanguage = ${duration}`); }
        return result;
    },
    
    /**
     * Get skip reason by code
     */
    getSkipReason(code: number): string {
        const start = performance.now();

        const reasons: Record<number, string> = {
            0: 'No skip (success)',
            1: 'Duplicate book',
            2: 'Language not allowed',
            3: 'Language blocked',
            4: 'Encoding not allowed',
            5: 'Encoding blocked',
            6: 'Genre blocked',
            7: 'Genre not allowed',
            8: 'Author blocked',
            9: 'XML parse failed',
            10: 'File read error',
            11: 'Other error',
            12: 'File size is zero',
	    13: 'Encoding mismatch'
        };

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.getSkipReason = ${duration}`); }

        return reasons[code] || 'Unknown error';
    },

    getParser() {
        const start = performance.now();

        const settings = {
            ignoreAttributes: false,
            attributeNamePrefix: '',
            textNodeName: '#text',
            parseTagValue: false,
            trimValues: true,
            maxNestedTags: 5000,
            allowBooleanAttributes: true,
            isArray: (tagName: string) => {
                const arrayTags = ['author', 'genre', 'p', 'section', 'title'];
                return arrayTags.includes(tagName);
            }};
        let result = new XMLParser(settings);

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.getParser = ${duration}`); }

        return result;
    },

    formatToHtml(xmlContent: string): string {
        const start = performance.now();

        let result = "";
        try {
            const parser = this.getParser();
            const xmlObj = parser.parse(xmlContent);
            if (!xmlObj || !xmlObj.FictionBook) { return this.getErrorHtml('Invalid FB2 document'); }
            let body = xmlObj.FictionBook.body; 
            if (Array.isArray(body)) { body = body[0]; }
            if (!body) { return '<p>No content available in this book.</p>'; }
            const processedContent = this.processContent(body);
            result = `<div style="word-wrap: break-word; overflow-wrap: break-word; max-width: 100%;">${processedContent}</div>`;
        } catch (error) {
            result = this.getErrorHtml(`Conversion error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.formatToHtml = ${duration}`); }

        return result;
    },

    processContent(content: any): string {
        const start = performance.now();
    
        let result = "";
        if (!content) {
            result = '';
        } else if (typeof content === 'string') {
            const trimmed = content.trim();
            result = trimmed ? this.escapeHtml(trimmed) : '';
        } else if (Array.isArray(content)) {
            result = content.map(item => this.processContent(item)).filter(Boolean).join('\n');
        } else {
            let html = '';
            for (const [tagName, value] of Object.entries(content)) {
                if (tagName === '_text' || tagName.startsWith('@_')) continue;
                const tag = tagName.toLowerCase();
                switch (tag) {
                    case 'section':
                        html += `<div class="fb2-section">\n`;
                        html += this.processContent(value);
                        html += `\n</div>\n`;
                        break;
    
                    case 'title':
                        const titleContent = this.processContent(value);
                        if (titleContent.trim()) {
                            html += `<h3>${titleContent}</h3>\n`;
                        }
                        break;
    
                    case 'style':
                        const styleContent = this.processContent(value);
                        html += `<p>${styleContent}</p>`;
                        break;
    
                    case 'p':
                        const pContent = this.processContent(value);
                        if (pContent.trim()) {
                            html += `<p style="white-space: pre-line; margin: 0 0 0.5em 0; word-wrap: break-word;">${pContent}</p>\n`;
                        }
                        break;
    
                    case 'epigraph':
                        html += `<blockquote style="margin: 0.5em 2em; font-style: italic;">\n`;
                        html += this.processContent(value);
                        html += `\n</blockquote>\n`;
                        break;
    
                    case 'poem':
                        html += `<div class="poem" style="margin: 0.5em 0;">\n`;
                        html += this.processContent(value);
                        html += `\n</div>\n`;
                        break;
    
                    case 'stanza':
                        html += `<div class="stanza" style="margin: 0.3em 0;">\n`;
                        html += this.processContent(value);
                        html += `\n</div>\n`;
                        break;
    
                    case 'v':
                        const vContent = this.processContent(value);
                        if (vContent.trim()) {
                            html += `<div style="margin-left: 2em; white-space: pre-line; word-wrap: break-word;">${vContent}</div>\n`;
                        }
                        break;
    
                    case 'strong':
                    case 'b':
                        const strongContent = this.processContent(value);
                        if (strongContent.trim()) {
                            html += `<strong>${strongContent}</strong>`;
                        }
                        break;
    
                    case 'emphasis':
                    case 'i':
                        const emphasisContent = this.processContent(value);
                        if (emphasisContent.trim()) {
                            html += `<em>${emphasisContent}</em>`;
                        }
                        break;
    
                    case 'sub':
                        const subContent = this.processContent(value);
                        if (subContent.trim()) {
                            html += `<sub>${subContent}</sub>`;
                        }
                        break;
    
                    case 'sup':
                        const supContent = this.processContent(value);
                        if (supContent.trim()) {
                            html += `<sup>${supContent}</sup>`;
                        }
                        break;
    
                    case 'a':
                        const attrs = value['@_'] || {};
                        const href = attrs.href || attrs['l:href'] || '#';
                        const linkContent = this.processContent(value);
                        if (linkContent.trim()) {
                            html += `<a href="${this.escapeHtml(href)}" style="word-wrap: break-word;">${linkContent}</a>`;
                        }
                        break;
    
                    case 'image':
                        const imgAttrs = value['@_'] || {};
                        const imgSrc = imgAttrs.href || imgAttrs['l:href'] || '';
                        if (imgSrc) {
                            html += `<div style="margin: 0.5em 0;">\n`;
                            html += `  <img src="${this.escapeHtml(imgSrc)}" alt="Illustration" style="max-width: 100%; height: auto;">\n`;
                            html += `</div>\n`;
                        }
                        break;
    
                    case 'empty-line':
                        html += `<br>\n`;
                        break;
    
                    case 'annotation':
                        html += `<div style="margin: 0.5em 0; padding: 0.5em; border-left: 3px solid #ccc;">\n`;
                        html += this.processContent(value);
                        html += `\n</div>\n`;
                        break;
    
                    case 'citation':
                    case 'cite':
                        html += `<cite style="display: block; margin: 0.5em 0;">\n`;
                        html += this.processContent(value);
                        html += `\n</cite>\n`;
                        break;
    
                    case 'code':
                        const codeContent = this.processContent(value);
                        if (codeContent.trim()) {
                            html += `<code style="display: block; white-space: pre-wrap; word-wrap: break-word; font-family: monospace;">${codeContent}</code>\n`;
                        }
                        break;
    
                    default:
                        const childContent = this.processContent(value);
                        if (childContent.trim()) {
                            html += childContent;
                        }
                        break;
                }
            }
            result = html;
        }
    
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.logPerformance) { logger.error(` - - fb2.processContent = ${duration}`); }
    
        return result;
    },    
    getErrorHtml(message: string): string {
        const start = performance.now();

        let result = `<div style="padding: 1em; border: 1px solid #f00; background: #fee; word-wrap: break-word;">
            <strong>Error Reading Book:</strong><br>
            ${this.escapeHtml(message)}
            <hr>
            <small>Possible causes:</small>
            <ul style="margin: 0.5em 0 0 1.5em;">
                <li>The FB2 file might be corrupted</li>
                <li>The file format might be invalid</li>
                <li>There might be missing required elements</li>
            </ul>
        </div>`;

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.logPerformance) { logger.error(` - - fb2.getErrorHtml = ${duration}`); }
    
        return result;
    },
    
    escapeHtml(str: string): string {
        const start = performance.now();

        let result = "";
        if (str) {
            result = str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.logPerformance) { logger.error(` - - fb2.escapeHtml = ${duration}`); }
    
        return result;
    },

    stripImagesFromFB2(data: Buffer | ArrayBuffer): Buffer {
        const start = performance.now();

        let result = "";

        const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data);
        const originalEncoding = this.detectEncodingFromBuffer(buffer);
        let xmlString = this.decodeBufferToUTF8(buffer, originalEncoding);
        xmlString = xmlString.replace(/^\uFEFF/, ''); // remove BOM if present
        const binaryRegex = /<binary[^>]*>[\s\S]*?<\/binary>|<binary[^>]*\/>/gi;
        let cleaned = xmlString.replace(binaryRegex, '');
        const imageRegex = /<image[^>]*>[\s\S]*?<\/image>|<image[^>]*\/>/gi;
        cleaned = cleaned.replace(imageRegex, '');
        if (originalEncoding === 'utf-8') {
            result = Buffer.from(cleaned, 'utf8');
        } else {
            result = iconv.encode(cleaned, originalEncoding);
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.logPerformance) { logger.error(` - - fb2.stripImagesFromFB2 = ${duration}`); }
    
        return result;
    },
    
    computeHashFromBuffer(buffer: Buffer): string {
        const start = performance.now();

        let result = crypto.createHash('sha256').update(buffer).digest('hex');

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.logPerformance) { logger.error(` - - fb2.computeHashFromBuffer = ${duration}`); }
    
        return result;
    },

    mapEncoding(enc) {
        const start = performance.now();

        let result = enc;
        if (result === 'utf-8') { result = 'utf-8'; }
        if (result === 'utf8') { result = 'utf-8'; }
        if (result === 'windows-1251' ) { result = 'windows-1251'};
        if (result === 'cp1251' ) { result = 'windows-1251'};
        if (result === 'win-1251' ) { result = 'windows-1251'};
        if (result === 'koi8-r') { result = 'koi8-r'};

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.logPerformance) { logger.error(` - - fb2.mapEncoding = ${duration}`); }
    
        return result;
    },

    detectEncodingFromBuffer(buffer: Buffer): string {
        const start = performance.now();

        let result = 'utf-8';
        const firstFewBytes = buffer.slice(0, 1024).toString('binary');
        const match = firstFewBytes.match(/encoding=["']([^"']+)["']/i);
        if (match) {
            result = this.mapEncoding(match[1].toLowerCase());
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.logPerformance) { logger.error(` - - fb2.mapEncoding = ${duration}`); }
    
        return result;
    },

    decodeBufferToUTF8(buffer: Buffer, encoding: string): string {
        const start = performance.now();
       
        let result = "";

        if (encoding === 'utf-8') {
            result = buffer.toString('utf-8');
        } else {
            result = iconv.decode(buffer, encoding);
        }

        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.logPerformance) { logger.error(` - - fb2.decodeBufferToUTF8 = ${duration}`); }
    
        return result;
    },

    validateFicbook(parsed) {
        const fictionBook = parsed.FictionBook || parsed.fictionbook;
        if (!fictionBook) {
            throw new Error('Missing FictionBook root element');
        }
	return fictionBook;
    },

    extractDescription(fictionBook) {
        return fictionBook.description || {};
    },

    extractTitle(description) {
        const titleInfo = description['title-info'] || {};
        return extractText(titleInfo['book-title']) || 'Unknown Title';
    },

    extractAuthors(description) {

        const titleInfo = description['title-info'] || {};
        const authors: string[] = [];
        const authorNodes = titleInfo.author;
        if (authorNodes) {
            const authorList = Array.isArray(authorNodes) ? authorNodes : [authorNodes];
            for (const auth of authorList) {
                const firstName = extractText(auth['first-name']) || '';
                const lastName = extractText(auth['last-name']) || '';
                const middleName = extractText(auth['middle-name']) || '';
                const fullName = [lastName, firstName, middleName].filter(Boolean).join(' ');
                if (fullName) authors.push(fullName);
            }
        }
        if (authors.length === 0) authors.push('Unknown Author');

        return authors;
    },

    extractGenres(description) {

        const titleInfo = description['title-info'] || {};
        const genres: string[] = [];
        const genreNodes = titleInfo.genre;
        if (genreNodes) {
            const genreList = Array.isArray(genreNodes) ? genreNodes : [genreNodes];
            for (const g of genreList) {
                const genreText = extractText(g);
                if (genreText) {
                    let processed = genreText.toLowerCase().replace(/-/g, '_');
                    genres.push(processed);
                }
            }
        }
        // Remove duplicates
        const uniqueGenres = [...new Set(genres)];
        genres.length = 0;
        genres.push(...uniqueGenres);
        return genres;
    },

    extractLang(description) {
        const titleInfo = description['title-info'] || {};
        let lang = DEFAULT_LANGUAGE;
        try {
            lang = titleInfo?.lang?.['#text'] || titleInfo?.lang || DEFAULT_LANGUAGE;
            if (typeof lang !== 'string') lang = DEFAULT_LANGUAGE;
        } catch { lang = DEFAULT_LANGUAGE; }
        return lang;
    },

    extractAnnotation(description) {
        const titleInfo = description['title-info'] || {};

        let descriptionText = '';
        const annotation = titleInfo.annotation;
        if (annotation) {
            if (typeof annotation === 'string') descriptionText = annotation;
            else if (Array.isArray(annotation)) descriptionText = annotation.map(p => p['#text'] || '').join(' ');
            else if (annotation['#text']) descriptionText = annotation['#text'];
        }

        return descriptionText;
    },

    extractYear(description) {
        const titleInfo = description['title-info'] || {};

        let year: number | undefined;
        if (titleInfo['date']) {
            let dateStr: string | undefined;
            if (typeof titleInfo['date'] === 'string') {
                dateStr = titleInfo['date'];
            } else if (typeof titleInfo['date'] === 'object') {
                if (titleInfo['date']['#text']) dateStr = titleInfo['date']['#text'];
                else if (Array.isArray(titleInfo['date']) && titleInfo['date'][0]?.['#text'])
                    dateStr = titleInfo['date'][0]['#text'];
            }
            if (dateStr) {
                const yearMatch = dateStr.match(/\d{4}/);
                if (yearMatch) year = parseInt(yearMatch[0], 10);
            }
        }

        return year;
    },

    extractSerie(description) {
        const titleInfo = description['title-info'] || {};
        let series: { name: string; number?: number } | undefined;
        const sequence = titleInfo.sequence;
        if (sequence) {
            const seqName = sequence.name;
            const seqNumber = sequence.number ? parseInt(sequence.number, 10) : undefined;
            if (seqName) series = { name: seqName, number: seqNumber };
        }
        return series;
    },

    extractMetadataFromBuffer(buffer: Buffer): { metadata: any; encoding: string; content: string; } {
        const start = performance.now();
        let result: { metadata: any; encoding: string; content: string; };
    
        try {
            const encoding = this.detectEncodingFromBuffer(buffer);
            const content = this.decodeBufferToUTF8(buffer, encoding);
            const parser = this.getParser();
            const parsed = parser.parse(content);
    
            const fictionBook = this.validateFicbook(parsed);
            const description = this.extractDescription(fictionBook);
            const title = this.extractTitle(description);
            const authors = this.extractAuthors(description);
            const genres = this.extractGenres(description);
            const lang = this.extractLang(description);
            const annotation = this.extractAnnotation(description);
            const year = this.extractYear(description);
            const series = this.extractSerie(description);

            const metadata = { title, authors, genres, lang, annotation, year, series, fileName: '' };
            result = { metadata, encoding, content };
        } catch (err) {
            logger.error(`extractMetadataFromBuffer failed: ${err instanceof Error ? err.message : err}`);
            result = { metadata: {}, encoding: '', content: '' };
        }
    
        const duration = ((performance.now() - start) / 1000).toFixed(2);
        if (this.LogPerformance) { logger.error(` - - fb2.extractMetadataFromBuffer = ${duration}`); }
    
        return result;
    },

    async extractChapters(filePath: string): Promise<string[]> {
        return extractChapters(filePath);
    }

};

/**
 * Extract chapter texts from an FB2 file (named export, so it can be used as
 * `import { extractChapters } from '../utils/fb2'`).
 *
 * Encoding-aware: FB2 files are frequently windows-1251 / koi8-r. We detect the
 * declared encoding and decode to UTF-8 before parsing instead of assuming UTF-8
 * (which would otherwise produce mojibake and garbage AI summaries).
 */
export async function extractChapters(filePath: string): Promise<string[]> {
    const buffer = await fs.promises.readFile(filePath);
    const encoding = fb2.detectEncodingFromBuffer(buffer);
    const xml = fb2.decodeBufferToUTF8(buffer, encoding);

    const parsed = await parseStringPromise(xml, { explicitArray: false, mergeAttrs: true });
    const body = parsed?.FictionBook?.body;
    if (!body) return [];

    // Flatten sections; each top-level <section> is treated as a chapter.
    const sections = Array.isArray(body.section) ? body.section : (body.section ? [body.section] : []);
    const chapters: string[] = [];
    for (const section of sections) {
        const textParts: string[] = [];
        const collect = (node: any): void => {
            if (typeof node === 'string') { textParts.push(node); return; }
            if (node && typeof node === 'object') {
                if (node.p) {
                    const paras = Array.isArray(node.p) ? node.p : [node.p];
                    for (const para of paras) {
                        if (typeof para === 'string') textParts.push(para);
                        else if (para && para._) textParts.push(para._);
                    }
                }
                for (const key in node) {
                    if (key !== 'p' && node[key]) collect(node[key]);
                }
            }
        };
        collect(section);
        if (textParts.length > 0) {
            chapters.push(textParts.join('\n\n'));
        }
    }
    return chapters;
}

export default fb2;
