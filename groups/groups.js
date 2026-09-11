const fs = require('fs');
const path = require('path');

const SEQNAME_FILE = 'lib.libseqname.sql';
const SEQ_FILE = 'lib.libseq.sql';
const OUTPUT_DIR = path.join(__dirname, 'groups');
const MAPPING_FILE = 'mapping.json';

// Fallback bucket for any SeqId that has no SeqName in libseqname.
const UNKNOWN_GROUP = 'Unknown';

// (SeqId, 'Name')
function parseLibSeqName(filepath) {
    const content = fs.readFileSync(filepath, 'utf-8');
    const regex = /\((\d+),'((?:[^'\\]|\\.)*)'\)/g;
    const seqMap = new Map();
    let m;
    while ((m = regex.exec(content)) !== null) {
        const seqId = parseInt(m[1], 10);
        const seqName = m[2].replace(/\\'/g, "'").replace(/''/g, "'");
        seqMap.set(seqId, seqName);
    }
    return seqMap;
}

// (BookId, SeqId, SeqNumb, Level, Type)
function parseLibSeq(filepath) {
    const content = fs.readFileSync(filepath, 'utf-8');
    const regex = /\((\d+),(\d+),\d+,\d+,\d+\)/g;
    const seqBooks = new Map();
    let m;
    while ((m = regex.exec(content)) !== null) {
        const bookId = parseInt(m[1], 10);
        const seqId  = parseInt(m[2], 10);
        if (!seqBooks.has(seqId)) seqBooks.set(seqId, new Set());
        seqBooks.get(seqId).add(bookId);
    }
    return seqBooks;
}

function sanitizeFilename(name) {
    let safe = String(name)
        .normalize('NFC')
        .replace(/[^\p{L}\p{N} ._()\-]+/gu, '_')
        .replace(/[_\s]+/g, ' ')
        .replace(/_+/g, '_')
        .replace(/^[\s.]+|[\s.]+$/g, '')
        .substring(0, 100)
        .trim();

    if (/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(\..*)?$/i.test(safe)) {
        safe = '_' + safe;
    }

    return safe || 'unnamed';
}

/**
 * Load mapping.json in READ-ONLY mode.
 * Returns a reverse map: { oldName -> newName }.
 *
 * The file is NEVER written to.
 * If it is missing, empty, or invalid, an empty mapping is used and every
 * SeqName becomes its own group (fallback handled in buildCategoryBooks).
 */
function loadMapping(mappingFile) {
    const mapping = {};

    if (fs.existsSync(mappingFile)) {
        // Friendly warning if the file is writable on disk.
        try {
            const st = fs.statSync(mappingFile);
            if (st.mode & 0o200) {
                console.warn(`Warning: ${mappingFile} is writable on disk — it should be read-only.`);
            }
        } catch (_) {
            // ignore stat errors
        }

        try {
            const raw = fs.readFileSync(mappingFile, 'utf-8');
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
                for (const [newName, oldNames] of Object.entries(parsed)) {
                    if (Array.isArray(oldNames)) {
                        mapping[newName] = oldNames.filter(
                            n => typeof n === 'string' && n.length > 0
                        );
                    } else {
                        console.error(`Warning: value for "${newName}" is not an array — ignoring.`);
                    }
                }
            } else {
                console.error(`Warning: ${mappingFile} is not a JSON object — treating as empty.`);
            }
        } catch (err) {
            console.error(`Warning: cannot parse ${mappingFile} (${err.message}). Treating as empty.`);
        }
    } else {
        console.error(`Warning: ${mappingFile} not found. Treating as empty.`);
    }

    // Build reverse index: old name -> new (group) name.
    const reverse = {};
    for (const [newName, oldNames] of Object.entries(mapping)) {
        for (const oldName of oldNames) {
            if (reverse[oldName] !== undefined && reverse[oldName] !== newName) {
                console.error(
                    `Warning: "${oldName}" is listed under both "${reverse[oldName]}" and "${newName}". ` +
                    `Keeping "${reverse[oldName]}".`
                );
                continue;
            }
            reverse[oldName] = newName;
        }
    }

    console.log(
        `Mapping loaded (READ-ONLY): ${Object.keys(mapping).length} group(s) / ` +
        `${Object.keys(reverse).length} old name(s).`
    );

    return reverse;
}

function buildCategoryBooks(seqMap, seqBooks, reverseMapping) {
    const categoryBooks  = new Map();
    const categorySeqIds = new Map();

    const mappingIsNonEmpty = Object.keys(reverseMapping).length > 0;
    let unknownBookCount = 0;
    let unknownSeqCount  = 0;

    for (const [seqId, bookIds] of seqBooks.entries()) {
        let categoryName;

        if (!seqMap.has(seqId)) {
            categoryName = UNKNOWN_GROUP;
            unknownSeqCount++;
            unknownBookCount += bookIds.size;
        } else {
            const oldName = seqMap.get(seqId);
            const mapped  = reverseMapping[oldName];

            categoryName = (mapped !== undefined && mapped !== null && mapped !== '') ? mapped : oldName;

            if (mappingIsNonEmpty && mapped === undefined) {
            } else {
                console.warn(`Mapping found "${oldName}" => ${categoryName}`);
            }
        }

        if (!categoryBooks.has(categoryName)) {
            categoryBooks.set(categoryName, new Set());
            categorySeqIds.set(categoryName, new Set());
        }
        const bookSet = categoryBooks.get(categoryName);
        for (const id of bookIds) bookSet.add(id);
        categorySeqIds.get(categoryName).add(seqId);
    }

    if (unknownSeqCount > 0) {
        console.warn(
            `Found ${unknownSeqCount} SeqId(s) missing from libseqname ` +
            `(${unknownBookCount} book link(s)) — grouped into "${UNKNOWN_GROUP}".`
        );
    }

    return { categoryBooks, categorySeqIds };
}

function extractExistingBookIds(sqlContent) {
    const ids = new Set();
    const regex = /WHERE `id` IN \(([^)]*)\)/g;
    let m;
    while ((m = regex.exec(sqlContent)) !== null) {
        for (const part of m[1].split(',')) {
            const n = parseInt(part.trim(), 10);
            if (!Number.isNaN(n)) ids.add(n);
        }
    }
    return ids;
}

function buildSqlContent(categoryName, seqIds, bookIds) {
    const sqlSafeName = categoryName.replace(/'/g, "''");
    const seqIdList = seqIds.length ? seqIds.join(', ') : '(none)';
    const lines = [
        `-- Auto-generated group for category: ${categoryName} (SeqIds: ${seqIdList})\n`,
        `INSERT IGNORE INTO \`groups\` (\`name\`, \`description\`) VALUES ('${sqlSafeName}', 'Imported from libseqname');`,
        `SET @gid = (SELECT \`id\` FROM \`groups\` WHERE \`name\` = '${sqlSafeName}' LIMIT 1);\n`,
        `-- Link books ONLY IF they exist in the \`books\` table`
    ];

    const sortedIds = Array.from(bookIds).sort((a, b) => a - b);
    const chunkSize = 500;
    for (let i = 0; i < sortedIds.length; i += chunkSize) {
        const chunk = sortedIds.slice(i, i + chunkSize);
        const idsStr = chunk.join(',');
        lines.push(
            `INSERT IGNORE INTO \`book_groups\` (\`book_id\`, \`group_id\`) ` +
            `SELECT \`id\`, @gid FROM \`books\` WHERE \`id\` IN (${idsStr}) AND @gid IS NOT NULL;`
        );
    }
    return lines.join('\n');
}

function generateSqlFiles(categoryBooks, categorySeqIds, outputDir) {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    console.log(`Generating SQL files into '${outputDir}'...`);

    let written = 0, skippedSmall = 0;
    for (const [categoryName, bookIdSet] of categoryBooks.entries()) {
        if (bookIdSet.size <= 1) { skippedSmall++; continue; }

        const safeName = sanitizeFilename(categoryName);
        const filePath = path.join(outputDir, `${safeName}.sql`);
        const seqIds = Array.from(categorySeqIds.get(categoryName)).sort((a, b) => a - b);

        const finalBookIds = new Set(bookIdSet);
        try {
            if (fs.existsSync(filePath)) {
                const existing = extractExistingBookIds(fs.readFileSync(filePath, 'utf-8'));
                for (const id of existing) finalBookIds.add(id);
            }
            fs.writeFileSync(filePath, buildSqlContent(categoryName, seqIds, finalBookIds), 'utf-8');
            written++;
        } catch (err) {
            console.error(`[!] Error writing ${safeName}.sql: ${err.message}`);
        }
    }

    console.log(`Done. Wrote ${written} SQL file(s); skipped ${skippedSmall} category(ies) with <=1 book.`);
    console.log(`Total files in output dir: ${fs.readdirSync(outputDir).length}`);
}

function main() {
    const sourceDir = __dirname;
    const seqNamePath = path.join(sourceDir, SEQNAME_FILE);
    const seqPath     = path.join(sourceDir, SEQ_FILE);
    const mappingPath = path.join(sourceDir, MAPPING_FILE);

    if (!fs.existsSync(seqNamePath) || !fs.existsSync(seqPath)) {
        console.error(`Error: '${SEQNAME_FILE}' and '${SEQ_FILE}' must sit next to this script.`);
        process.exit(1);
    }

    console.log('Parsing sequence names...');
    const seqMap = parseLibSeqName(seqNamePath);
    console.log(`  ${seqMap.size} sequence names.`);

    console.log('Parsing book -> seq mappings...');
    const seqBooks = parseLibSeq(seqPath);
    console.log(`  ${seqBooks.size} sequences referenced by books.`);

    console.log('Loading category mapping (READ-ONLY)...');
    const reverseMapping = loadMapping(mappingPath);

    const { categoryBooks, categorySeqIds } = buildCategoryBooks(seqMap, seqBooks, reverseMapping);
    console.log(`Resolved to ${categoryBooks.size} categories after mapping.`);

    generateSqlFiles(categoryBooks, categorySeqIds, OUTPUT_DIR);
}

main();