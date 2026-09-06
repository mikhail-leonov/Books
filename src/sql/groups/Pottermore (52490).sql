-- Auto-generated group for sequence: Pottermore (ID: 52490)

INSERT IGNORE INTO `groups` (`name`, `description`) VALUES ('Pottermore', 'Imported from libseqname');
SET @gid = (SELECT `id` FROM `groups` WHERE `name` = 'Pottermore' LIMIT 1);

-- Link books ONLY IF they exist in the `books` table
INSERT IGNORE INTO `book_groups` (`book_id`, `group_id`) SELECT `id`, @gid FROM `books` WHERE `id` IN (465788,466110,466117,466122,466148,514876,514877,514878,514879,514880,514881,514883,514887) AND @gid IS NOT NULL;