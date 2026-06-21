Role: You are a Senior Full-Stack Engineer specializing in Node.js, TypeScript, and SQLite.
Objective: Build a one user, local-network MVC FB2 book manager that automatically imports, cleans, and catalogs e-books.

1. Technical Stack & Architecture
Runtime: Node.js (TypeScript).
Database: SQLite (better-sqlite3) with FTS5 for full-text search.
File Handling: chokidar (watcher), adm-zip (extraction), fast-xml-parser (FB2/XML), iconv-lite (re-coding).
Concurrency: worker_threads (or piscina) for CPU-heavy XML parsing and re-encoding.
API: make a simple routing code (RESTful).
Logging: winston for persistent system logs.

2. Database Schema (Normalization)
Design a schema with the following tables:
books: id, title, description, file_path, liked (boolean), created_at.
authors: id, name.
series: id, name.
genres: id (FB2 short-string ID), name (Full name).
Junction Tables: book_authors, book_genres, book_series (to support Many-to-Many).

FTS Table: Virtual table books_fts mapping to books(title, description).
3. Core Logic & Workers
Implement a processing pipeline for new files:

Detection: Monitor /inbox for any files 
- One process should delete any other than .zip and .fb2 file types.
- Another process if detected zip files unzip them 
- One another process If detected .fb2 files run import for a new .fb2 content.

Sanitization & Re-encoding:
Detect source encoding (e.g., Windows-1251, Windows-1252, KOI8-R).
Convert content to UTF-8.
Update the XML declaration: <?xml version="1.0" encoding="UTF-8"?>.

Strip Images: Remove all <binary> tags to optimize storage.
Storage: Save the modified .fb2 file to /library and index metadata in SQLite.

4. API Requirements
CRUD: Endpoints for Books, Authors, Series, and Genres.
Search: GET /search?q=... utilizing SQLite FTS5.
Social: POST /books/:id/like and /unlike.
System Logs: GET /logs to retrieve the latest winston events.
Prevent ability to run injection attacks

5. Expected Output
install.sh: Script to create folders (/src, /inbox, /library), npm init, and install all dependencies.
tsconfig.json & package.json.
Directory Structure: Use a clean src/ folder with subdirectories for services/, workers/, db/, and routes/.

Implementation: Complete TypeScript source code for the watcher, the worker thread, the database wrapper, and the Express server.