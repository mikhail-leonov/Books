--
-- Tables
--

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(512) NOT NULL,
    description TEXT,
    ai_description TEXT DEFAULT '',
    file_path VARCHAR(768) NOT NULL,
    liked TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    import_key VARCHAR(255),
    UNIQUE KEY uq_books_file_path (file_path),
    KEY idx_books_title (title),
    KEY idx_books_liked (liked),
    KEY idx_books_created_at (created_at),
    KEY idx_books_import_key (import_key),
    FULLTEXT KEY ft_books (title, description, ai_description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Authors table
CREATE TABLE IF NOT EXISTS authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    UNIQUE KEY uq_authors_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Genres table 
CREATE TABLE IF NOT EXISTS genres (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    KEY idx_genres_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Series table
CREATE TABLE IF NOT EXISTS series (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    UNIQUE KEY uq_series_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Groups table 
CREATE TABLE IF NOT EXISTS groups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    UNIQUE KEY uq_groups_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    UNIQUE KEY uq_tags_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- book - author
CREATE TABLE IF NOT EXISTS book_authors (
    book_id INT NOT NULL,
    author_id INT NOT NULL,
    PRIMARY KEY (book_id, author_id),
    KEY idx_book_authors_author_id (author_id),
    CONSTRAINT fk_ba_book   FOREIGN KEY (book_id)   REFERENCES books(id)   ON DELETE CASCADE,
    CONSTRAINT fk_ba_author FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- book - genre
CREATE TABLE IF NOT EXISTS book_genres (
    book_id INT NOT NULL,
    genre_id VARCHAR(64) NOT NULL,
    PRIMARY KEY (book_id, genre_id),
    KEY idx_book_genres_genre_id (genre_id),
    CONSTRAINT fk_bg_book  FOREIGN KEY (book_id)  REFERENCES books(id)  ON DELETE CASCADE,
    CONSTRAINT fk_bg_genre FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- book - series
CREATE TABLE IF NOT EXISTS book_series (
    book_id INT NOT NULL,
    serie_id INT NOT NULL,
    serie_order INT,
    PRIMARY KEY (book_id, serie_id),
    KEY idx_book_series_series_id (serie_id),
    CONSTRAINT fk_bs_book   FOREIGN KEY (book_id)  REFERENCES books(id)  ON DELETE CASCADE,
    CONSTRAINT fk_bs_series FOREIGN KEY (serie_id) REFERENCES series(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- book - group
CREATE TABLE IF NOT EXISTS book_groups (
    book_id INT NOT NULL,
    group_id INT NOT NULL,
    PRIMARY KEY (book_id, group_id),
    KEY idx_book_groups_group_id (group_id),
    CONSTRAINT fk_bgr_book  FOREIGN KEY (book_id)  REFERENCES books(id)   ON DELETE CASCADE,
    CONSTRAINT fk_bgr_group FOREIGN KEY (group_id) REFERENCES groups(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- book - tag
CREATE TABLE IF NOT EXISTS book_tags (
    book_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (book_id, tag_id),
    KEY idx_book_tags_tag_id (tag_id),
    CONSTRAINT fk_bt_book FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    CONSTRAINT fk_bt_tag  FOREIGN KEY (tag_id)  REFERENCES tags(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;