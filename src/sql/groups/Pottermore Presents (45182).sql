-- Auto-generated group for sequence: Pottermore Presents (ID: 45182)

INSERT IGNORE INTO `groups` (`name`, `description`) VALUES ('Pottermore Presents', 'Imported from libseqname');
SET @gid = (SELECT `id` FROM `groups` WHERE `name` = 'Pottermore Presents' LIMIT 1);

-- Link books ONLY IF they exist in the `books` table
INSERT IGNORE INTO `book_groups` (`book_id`, `group_id`) SELECT `id`, @gid FROM `books` WHERE `id` IN (460662,460666,460672,514876,514877,514878) AND @gid IS NOT NULL;