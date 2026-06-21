# FB2 Manager

A self-hosted web application for cataloguing, browsing, reading, and managing a personal library of **FB2** e-books. It imports `.fb2` files (individually or in `.zip` archives), extracts their metadata, organizes them by author / genre / series / group / tag, stores the files in a deduplicated library, and serves everything through a Twig-based web interface and a JSON API. It can optionally generate book descriptions with a local **Ollama** model and e-mail a book to any address.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the App](#running-the-app)
- [Importing Books](#importing-books)
- [Using the Web UI](#using-the-web-ui)
- [AI Descriptions (Ollama)](#ai-descriptions-ollama)
- [Emailing a Book](#emailing-a-book)
- [API Reference](#api-reference)
- [Directory Layout](#directory-layout)
- [Maintenance Scripts](#maintenance-scripts)
- [Troubleshooting](#troubleshooting)

---

## Features

- **FB2 import pipeline** — drop files into an `inbox/` folder (or upload through the UI). Zip archives are extracted automatically, FB2 metadata is parsed, and books are filed into a content-addressed `library/`.
- **Automatic deduplication** — each file is hashed (MD5); identical content is never stored twice.
- **Rich metadata model** — books are linked to authors, genres, series (with order), groups, and tags via dedicated join tables.
- **Content filtering on import** — books are skipped based on language, encoding, genre, author, encoding mismatch, empty files, and duplicates (see [Importing Books](#importing-books)).
- **Web UI** — browse and search books, authors, genres, series, and groups; read FB2 content in the browser; view statistics.
- **JSON API** — full CRUD plus merge operations for every entity, like/unlike, grouping, import trigger, and upload.
- **AI descriptions** — generate a description for any book through a local Ollama model.
- **Email delivery** — send a book file as an attachment via SMTP.
- **Rotating logs** — daily-rotated application logs plus a dedicated error log, written under `logs/`.

---

## Tech Stack

- **Runtime:** Node.js + TypeScript
- **Web framework:** Express
- **Templating:** Twig (`twig` package)
- **Database:** MariaDB (connection pool via the `mariadb` driver)
- **File uploads:** `express-fileupload`
- **Archive handling:** `unzipper`
- **Logging:** `winston` + `winston-daily-rotate-file`
- **AI:** Ollama HTTP API (via `axios`)
- **Email:** `nodemailer`
- **Config:** `dotenv`

---

## Prerequisites

Before installing, make sure you have:

1. **Node.js** (LTS recommended) and npm.
2. **MariaDB** (or MySQL-compatible) server running and reachable. A local **XAMPP** install works well; the MariaDB client typically lives at `…\mysql\bin\mysql.exe`.
3. **(Optional) Ollama** running locally if you want AI-generated descriptions — default endpoint `http://localhost:11434`.
4. **(Optional) An SMTP account** if you want to e-mail books.

You do **not** need to create the database or tables by hand — the app creates the database if it is missing and applies the schema and seed data on first run (see [Running the App](#running-the-app)).

---

## Installation

```bash
# 1. Clone / copy the project, then from the project root:
npm install

# 2. Create a .env file (see Configuration below).

# 3. Make sure MariaDB is running.
```

> The project uses a `package.json` for its scripts and dependencies. Run `npm run` to see the exact scripts defined in your copy (typical names are `build`, `start`, and/or `dev`). The sections below show the commands the bundled `.cmd` helpers use.

---

## Configuration

All configuration is read from environment variables (via a `.env` file in the project root). Every value has a sensible default, so you only need to set the ones that differ from your setup.

| Variable        | Purpose                                  | Default                  |
|-----------------|------------------------------------------|--------------------------|
| `PORT`          | HTTP port the server listens on          | `3000`                   |
| `DB_HOST`       | MariaDB host                             | `localhost`              |
| `DB_PORT`       | MariaDB port                             | `3306`                   |
| `DB_USER`       | MariaDB user                             | `fb2`                    |
| `DB_PASSWORD`   | MariaDB password                         | `1`                      |
| `DB_NAME`       | Database name (auto-created if missing)  | `fb2`                    |
| `OLLAMA_HOST`   | Ollama base URL for AI descriptions      | `http://localhost:11434` |
| `OLLAMA_MODEL`  | Ollama model tag                         | `qwen3`                  |
| `SMTP_HOST`     | SMTP server host (email feature)         | _unset_                  |
| `SMTP_PORT`     | SMTP server port                         | `587`                    |
| `SMTP_USER`     | SMTP username                            | _unset_                  |
| `SMTP_PASS`     | SMTP password                            | _unset_                  |
| `SMTP_FROM`     | "From" address for outgoing mail         | _unset_                  |

Example `.env`:

```ini
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=fb2
DB_PASSWORD=1
DB_NAME=fb2

OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=qwen3

# Optional — only needed for the "email a book" feature
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=you@example.com
SMTP_PASS=your_password
SMTP_FROM=you@example.com
```

> **Note:** the database password variable is `DB_PASSWORD` (not `DB_PASS`). The maintenance batch scripts use their own separate variables — see [Maintenance Scripts](#maintenance-scripts).

---

## Running the App

Start your MariaDB server first, then launch the app (use whichever script your `package.json` defines — for a TypeScript project this is usually a `build` + `start`, or a `dev` runner):

```bash
npm start
# or, during development:
npm run dev
```

On startup the server will:

1. Ensure the required folders exist (`inbox/`, `library/`, `logs/`).
2. **Initialize the database** — create the database if it does not exist, apply `src/sql/schema.sql` if the database has no tables, and run the seed files (`genres.sql`, `groups.sql`, etc.) inside a transaction, but only for tables that are still empty.
3. Begin listening and print the URLs:

```
FB2 Manager vX.Y.Z listening on:
 - Local:   http://localhost:3000
 - Network: http://<your-lan-ip>:3000
```

Open the **Local** URL in a browser to use the app. The **Network** URL lets other devices on your LAN reach it.

The process handles `SIGINT`/`SIGTERM` for a graceful shutdown.

---

## Importing Books

The import system is built around three folders in the project root:

- **`inbox/`** — the drop zone. Place `.fb2` files or `.zip` archives here.
- **`library/`** — permanent storage. Accepted books are saved as `library/<md5-hash>.fb2`.
- **`logs/`** — import results are recorded here.

### How to import

There are two ways to feed the inbox:

1. **Copy files directly** into `inbox/` (subfolders are allowed — see "Groups" below), then trigger a run.
2. **Upload through the web UI** import page, which writes the files into `inbox/` for you.

Then **start the import**, either from the UI's import page or by calling the API:

```bash
curl -X POST http://localhost:3000/api/import/run
```

### What happens during a run

1. Every `.zip` in `inbox/` is extracted in place, then the archive is deleted.
2. Each `.fb2` file is processed:
   - The importer waits until the file size is stable (so partially-copied files aren't read).
   - Metadata is parsed from the FB2 (title, authors, genres, series, language, encoding).
   - **Filters** are applied (see codes below). Rejected files are either deleted or, for "review-worthy" rejections, moved into a numbered sub-folder so you can inspect them.
   - The file's MD5 hash is computed. If a book with the same content already exists, it is treated as a duplicate.
   - Accepted books are copied to `library/<hash>.fb2` and inserted into the database with all their author/genre/series/group links.
3. The run returns a summary: number processed, number of errors, and a log.

### Groups from folder structure

If you place files inside sub-folders of `inbox/` (e.g. `inbox/MySeries/book.fb2`), the folder name(s) are captured as **groups** and linked to the imported book.

### Skip / filter reason codes

Imports are filtered using configurable allow-lists (languages, encodings, genres) defined in `src/config/`. A book is skipped with one of these codes:

| Code | Reason                                            |
|------|---------------------------------------------------|
| 0    | OK (not skipped)                                  |
| 1    | Duplicate book                                    |
| 2, 3 | Language not allowed                              |
| 4, 5 | Encoding not allowed                              |
| 6, 7 | Genre not in the allowed list                     |
| 8    | Author blocked                                    |
| 11   | File stat error                                   |
| 12   | File size is zero                                 |
| 13   | Declared encoding doesn't match detected encoding |

Allow-lists you can edit:

- `src/config/allowedLanguages.ts` — default `ru`, `en`
- `src/config/allowedEncodings.ts` — e.g. `utf-8`, `windows-1251`, `koi8-r`, …
- `src/config/allowedGenres.ts` — the set of accepted genre codes (heavily weighted toward SF/fantasy/romance/adventure)

Duplicate-skipping and the blocked lists are controlled by the `config` object in `src/utils/fb2.ts`.

---

## Using the Web UI

The UI is served from the same port as the API. Main pages:

| Path        | Page                                   |
|-------------|----------------------------------------|
| `/`         | All books (with search & pagination)   |
| `/authors`  | Authors                                |
| `/genres`   | Genres                                 |
| `/series`   | Series                                 |
| `/groups`   | Groups                                 |

From the book views you can read a book in the browser, like/unlike it, assign it to groups, generate an AI description, and (if configured) e-mail it. There is also an **import** page for uploading files and starting a run, and a **stats** page summarizing the library.

---

## AI Descriptions (Ollama)

If you have [Ollama](https://ollama.com) running locally, the app can generate a description for any book.

1. Make sure Ollama is running and the configured model is pulled, e.g.:
   ```bash
   ollama pull qwen3
   ```
2. Set `OLLAMA_HOST` / `OLLAMA_MODEL` in `.env` if they differ from the defaults.
3. Trigger generation for a book (from the UI, or via the API):
   ```bash
   curl -X POST http://localhost:3000/api/books/<id>/ai
   ```

Reasoning-model `<think>…</think>` blocks are stripped automatically before the text is stored, and the AI description is saved to the book's `ai_description` field.

---

## Emailing a Book

With the `SMTP_*` variables configured, you can send a book file as an attachment:

```bash
curl -X POST http://localhost:3000/api/email-book/<id>/<recipient@example.com>
```

The recipient receives the original `.fb2` file attached to the message.

---

## API Reference

All API routes are mounted under `/api`. Responses are JSON.

### Books — `/api/books`

| Method   | Path                       | Description                          |
|----------|----------------------------|--------------------------------------|
| `GET`    | `/api/books`               | List books (paginated)               |
| `GET`    | `/api/books/search`        | Search books                         |
| `GET`    | `/api/books/:id`           | Get one book                         |
| `POST`   | `/api/books`               | Create a book                        |
| `PUT`    | `/api/books/:id`           | Update a book                        |
| `DELETE` | `/api/books/:id`           | Delete a book (and its file)         |
| `POST`   | `/api/books/:id/ai`        | Generate AI description              |
| `POST`   | `/api/books/:id/like`      | Mark as liked                        |
| `POST`   | `/api/books/:id/unlike`    | Remove like                          |
| `GET`    | `/api/books/:id/group/:gid`     | List/inspect group link         |
| `GET`    | `/api/books/:id/group/:gid/1`   | Link book to group              |
| `GET`    | `/api/books/:id/group/:gid/0`   | Unlink book from group          |

### Authors — `/api/authors`

| Method | Path                      | Description            |
|--------|---------------------------|------------------------|
| `GET`  | `/api/authors`            | List authors           |
| `GET`  | `/api/authors/:id`        | Get one author         |
| `POST` | `/api/authors/create`     | Create author          |
| `PUT`  | `/api/authors/:id/edit`   | Update author          |
| `GET`  | `/api/authors/:id/delete` | Delete author          |
| `POST` | `/api/authors/merge`      | Merge two authors      |

### Genres — `/api/genres`, Series — `/api/series`, Groups — `/api/groups`

These follow the same shape as authors: `GET /`, `GET /:id`, `POST /create`, `PUT /:id/edit`, `GET /:id/delete`, `POST /merge`. (Series and groups use numeric IDs; genres use string IDs.)

### Other — `/api`

| Method | Path                          | Description                                  |
|--------|-------------------------------|----------------------------------------------|
| `POST` | `/api/import/run`             | Run the import pipeline over `inbox/`        |
| `POST` | `/api/upload`                 | Upload files into `inbox/` (multipart; field `files`, plus `originalNames`) |
| `POST` | `/api/email-book/:id/:mail`   | Email a book to an address                   |

---

## Directory Layout

```
Books/
├─ src/
│  ├─ index.ts            # Express entry point (server, middleware, routes)
│  ├─ config/             # Allowed languages / encodings / genres
│  ├─ controllers/        # API + UI controllers
│  ├─ routes/             # Express routers (api* and ui*)
│  ├─ services/           # Business-logic layer
│  ├─ models/             # Domain models (books, authors, import, …)
│  ├─ db/                 # MariaDB pool, init/seeding, per-entity data access
│  ├─ sql/                # schema.sql + seed data (genres.sql, groups.sql, …)
│  ├─ utils/              # fb2 parser, ollama client, logger, helpers, …
│  ├─ types/              # TypeScript types
│  └─ views/              # Twig templates (+ partials)
├─ public/                # Static assets (css, js)
├─ inbox/                 # Drop zone for files to import   (auto-created)
├─ library/              # Stored books, named by MD5 hash  (auto-created)
└─ logs/                  # Rotating application + error logs (auto-created)
```

### Database schema

Core tables: `books`, `authors`, `genres`, `series`, `groups`, `tags`, plus the join tables `book_authors`, `book_genres`, `book_series` (with `serie_order`), `book_groups`, and `book_tags`. All join tables cascade on delete. The full definition lives in `src/sql/schema.sql`.

---

## Maintenance Scripts

The project ships with Windows batch helpers in the project root:

- **`run.cmd`** — kills any running Node processes and starts the server fresh.
- **`reset.bat`** — a full reset: stops the server, **drops all tables** in the database, clears the `library/` folder, and restores the SQL seed files. Edit the connection variables at the top (`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME`, and the `MYSQL` client path, e.g. `D:\xampp\mysql\bin\mysql.exe`) before running it. **This is destructive** — it erases your catalogue.

> The reset script's variables are independent of the app's `.env`. In particular it uses `DB_PASS` for the password, whereas the application reads `DB_PASSWORD`.

---

## Troubleshooting

**App exits with "unrecoverable database initialization failure".**
The database init runs the schema and seed files in a transaction; if any seed statement fails, initialization aborts and the process exits. Check the console / `logs/error.log` for the underlying SQL error. Verify the DB credentials in `.env`, that the MariaDB server is running, and that the user has rights on the target database.

**`Access denied for user ... (using password: NO/YES)`.**
The credentials are wrong or the password isn't being sent. Confirm `DB_USER`/`DB_PASSWORD`/`DB_NAME` in `.env`, and that the user has access to the database. You can test independently with:
```bash
mysql -u fb2 -p fb2 -e "SHOW TABLES;"
```

**`'…mysql.exe' is not recognized` (Windows batch scripts).**
The client path is wrong. XAMPP ships the client as `mysql.exe` (not `mariadb.exe`), usually at `…\mysql\bin\mysql.exe`. List the folder to confirm: `dir <xampp>\mysql\bin\*.exe`.

**Uploads succeed but nothing imports.**
Uploading only places files in `inbox/`. You must then trigger a run (UI import button, or `POST /api/import/run`). Also check the skip-reason codes above — the book may have been filtered out by language/genre/encoding rules.

**AI description requests fail.**
Ensure Ollama is running at `OLLAMA_HOST` and the `OLLAMA_MODEL` is pulled. The request has a long timeout, but a missing model or unreachable host will surface in `logs/error.log`.

**Logs.**
Application logs rotate daily under `logs/application-YYYY-MM-DD.log` (kept 14 days); errors also go to `logs/error.log`."# Books" 
"# Books" 
