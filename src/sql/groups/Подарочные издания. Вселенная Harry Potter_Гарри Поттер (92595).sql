-- Auto-generated group for sequence: Подарочные издания. Вселенная Harry Potter/Гарри Поттер (ID: 92595)

INSERT IGNORE INTO `groups` (`name`, `description`) VALUES ('Подарочные издания. Вселенная Harry Potter/Гарри Поттер', 'Imported from libseqname');
SET @gid = (SELECT `id` FROM `groups` WHERE `name` = 'Подарочные издания. Вселенная Harry Potter/Гарри Поттер' LIMIT 1);

-- Link books ONLY IF they exist in the `books` table
INSERT IGNORE INTO `book_groups` (`book_id`, `group_id`) SELECT `id`, @gid FROM `books` WHERE `id` IN (789846) AND @gid IS NOT NULL;