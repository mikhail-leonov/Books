-- =========================
-- GENRES
-- =========================

-- Business & Economics
INSERT INTO genres (id, name) VALUES ('economics_ref', 'Деловая литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('popular_business', 'Карьера, кадры') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('org_behavior', 'Маркетинг, PR') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('banking', 'Финансы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('economics', 'Экономика') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Detectives & Thrillers
INSERT INTO genres (id, name) VALUES ('det_artifact', 'Артефакт-детективы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_action', 'Боевик') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_lady', 'Дамский детективный роман') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('detective', 'Детективы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_other', 'Детективы и триллеры: прочее') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_irony', 'Иронический детектив') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_history', 'Исторический детектив') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_classic', 'Классический детектив') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_crime', 'Криминальный детектив') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_hard', 'Крутой детектив') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_political', 'Политический детектив') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_police', 'Полицейский детектив') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_maniac', 'Про маньяков') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_su', 'Советский детектив') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('thriller', 'Триллер') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('det_espionage', 'Шпионский детектив') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Children's Literature
INSERT INTO genres (id, name) VALUES ('children', 'Детская литература: прочее') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_education', 'Детская образовательная литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_game', 'Детский досуг') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_folklore', 'Детский фольклор') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('foreign_children', 'Зарубежная литература для детей') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_classical', 'Классическая детская литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_tale', 'Литературные и народные сказки: прочее') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('folk_tale', 'Народные сказки') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_tale_rus', 'Русские сказки') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_tale_foreign_writers', 'Сказки зарубежных писателей') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_tale_russian_writers', 'Сказки отечественных писателей') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_prose_history', 'Детская проза: военная и историческая') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_adv_animal', 'Детская проза: о животных и природе') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_adv', 'Детская проза: приключения') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_prose', 'Детская проза: прочее') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_prose_romantic', 'Детская проза: романтическая') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_prose_humor', 'Детская проза: юмористическая, о школе и школьниках') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_sf_space', 'Детская фантастика: космические приключения, пришельцы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_sf', 'Детская фантастика: прочее') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_sf_hronoopera', 'Детская фантастика: темпоральная, попаданцы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_sf_horror', 'Детская фантастика: ужасы и мистика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_sf_fantasy', 'Детская фантастика: фэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_det_children_detectives', 'Детские детективы: дети-сыщики') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_det_animal_detectives', 'Детские детективы: животные-сыщики') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_det_other', 'Детские детективы: прочее') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_det', 'Детские остросюжетные: прочее') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_dramaturgy', 'Драматургия для детей и подростков') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('child_verse', 'Стихи для детей и подростков') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Non-Fiction
INSERT INTO genres (id, name) VALUES ('nonf_biography_celebrities', 'Биографии и мемуары: звезды кино, театра, балета, шоу-бизнеса') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('nonf_biography_historical', 'Биографии и мемуары: исторические персоны') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('about_musicians', 'Биографии и мемуары: музыканты, композиторы, художники') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('nonf_biography_writers', 'Биографии и мемуары: писатели, поэты, драматурги') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('nonf_biography', 'Биографии и мемуары: прочее') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('nonf_military', 'Военная документалистика и аналитика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('military_special', 'Военное дело') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('nonf_biography_military_figures', 'Военные мемуары') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('travel_notes', 'География, путевые заметки') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('nonfiction', 'Документальная литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('nonf_publicism', 'Публицистика') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Home & Family
INSERT INTO genres (id, name) VALUES ('auto_regulations', 'Автомобили и ПДД') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home_sport', 'Боевые искусства, спорт') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home_pets', 'Домашние животные') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home', 'Домоводство') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home_health', 'Здоровье') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home_collecting', 'Коллекционирование') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home_cooking', 'Кулинария') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_pedagogy', 'Педагогика, воспитание детей, литература для родителей') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_psychology_popular', 'Популярная психология') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home_entertain', 'Развлечения') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home_garden', 'Сад и огород') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home_diy', 'Сделай сам') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('family', 'Семейные отношения') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home_sex', 'Семейные отношения, секс') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('home_crafts', 'Хобби и ремесла') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Drama
INSERT INTO genres (id, name) VALUES ('drama_antique', 'Античная драма') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('drama', 'Драма') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('dramaturgy', 'Драматургия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('comedy', 'Комедия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('vaudeville', 'Мистерия, буффонада, водевиль') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('screenplays', 'Сценарий') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('tragedy', 'Трагедия') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Art & Design
INSERT INTO genres (id, name) VALUES ('painting', 'Живопись, альбомы, иллюстрированные каталоги') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('design', 'Искусство и Дизайн') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('art_criticism', 'Искусствоведение') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('cine', 'Кино') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('nonf_criticism', 'Критика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_culture', 'Культурология') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('art_world_culture', 'Мировая художественная культура') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('music', 'Музыка') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('notes', 'Партитуры') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('architecture_book', 'Скульптура и архитектура') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('theatre', 'Театр') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Computers
INSERT INTO genres (id, name) VALUES ('computers', 'Зарубежная компьютерная, околокомпьютерная литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('comp_hard', 'Компьютерное ''железо'' (аппаратное обеспечение), цифровая обработка сигналов') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('comp_www', 'ОС и Сети, интернет') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('comp_db', 'Программирование, программы, базы данных') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('tbg_computers', 'Учебные пособия, самоучители') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Romance
INSERT INTO genres (id, name) VALUES ('love_history', 'Исторические любовные романы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('love_short', 'Короткие любовные романы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('love_sf', 'Любовное фэнтези, любовно-фантастические романы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('love', 'Любовные романы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('love_detective', 'Остросюжетные любовные романы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('love_hard', 'Порно') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('love_contemporary', 'Современные любовные романы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('love_erotica', 'Эротическая литература') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Science & Education
INSERT INTO genres (id, name) VALUES ('sci_medicine_alternative', 'Альтернативная медицина') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_theories', 'Альтернативные науки и научные теории') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_cosmos', 'Астрономия и Космос') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_biology', 'Биология, биофизика, биохимия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_botany', 'Ботаника') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_veterinary', 'Ветеринария') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('military_history', 'Военная история') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_oriental', 'Востоковедение') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_geo', 'Геология и география') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_state', 'Государство и право') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_zoo', 'Зоология') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_history', 'История') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_philology', 'Литературоведение') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_math', 'Математика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_medicine', 'Медицина') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('science', 'Научная литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_popular', 'Образовательная, прикладная, научно-популярная литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_social_studies', 'Обществознание, социология') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_politics', 'Политика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_psychology', 'Психология и психотерапия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_phys', 'Физика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_philosophy', 'Философия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_chem', 'Химия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_ecology', 'Экология') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_economy', 'Экономика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_juris', 'Юриспруденция') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_linguistic', 'Языкознание, иностранные языки') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Poetry
INSERT INTO genres (id, name) VALUES ('palindromes', 'Визуальная и экспериментальная поэзия, верлибры, палиндромы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('poetry_for_classical', 'Классическая зарубежная поэзия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('poetry_classical', 'Классическая поэзия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('poetry_rus_classical', 'Классическая русская поэзия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('lyrics', 'Лирика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('song_poetry', 'Песенная поэзия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('poetry', 'Поэзия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('poetry_east', 'Поэзия Востока') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('poem', 'Поэма, эпическая поэзия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('poetry_for_modern', 'Современная зарубежная поэзия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('poetry_modern', 'Современная поэзия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('poetry_rus_modern', 'Современная русская поэзия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('humor_verse', 'Юмористические стихи, басни') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Adventure
INSERT INTO genres (id, name) VALUES ('adv_story', 'Авантюрный роман') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('adv_indian', 'Вестерн, про индейцев') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('adv_history', 'Исторические приключения') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('adv_maritime', 'Морские приключения') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('adventure', 'Приключения') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('adv_modern', 'Приключения в современном мире') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('adv_animal', 'Природа и животные') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('adv_geo', 'Путешествия и география') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('tale_chivalry', 'Рыцарский роман') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Prose
INSERT INTO genres (id, name) VALUES ('aphorisms', 'Афоризмы, цитаты') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('gothic_novel', 'Готический роман') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('foreign_prose', 'Зарубежная классическая проза') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_history', 'Историческая проза') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_classic', 'Классическая проза') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('literature_18', 'Классическая проза XVII-XVIII веков') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('literature_19', 'Классическая проза ХIX века') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('literature_20', 'Классическая проза ХX века') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_counter', 'Контркультура') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_magic', 'Магический реализм') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('story', 'Малые литературные формы прозы: рассказы, эссе, новеллы, феерия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose', 'Проза') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_military', 'Проза о войне') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('great_story', 'Роман, повесть') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_rus_classic', 'Русская классическая проза') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_su_classics', 'Советская классическая проза') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_contemporary', 'Современная русская и зарубежная проза') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('foreign_antique', 'Средневековая классическая проза') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_abs', 'Фантасмагория, абсурдистская проза') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('prose_neformatny', 'Экспериментальная, неформатная проза') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('epistolary_fiction', 'Эпистолярная проза') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Miscellaneous
INSERT INTO genres (id, name) VALUES ('periodic', 'Журналы, газеты') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('comics', 'Комиксы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('fan_translation', 'Любительский перевод') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('computer_translation', 'Машинный перевод') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('unfinished', 'Незавершенное') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('other', 'Неотсортированное') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('network_literature', 'Самиздат, сетевая литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('fanfiction', 'Фанфик') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Religion & Esoterics
INSERT INTO genres (id, name) VALUES ('astrology', 'Астрология и хиромантия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_budda', 'Буддизм') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_hinduism', 'Индуизм') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_islam', 'Ислам') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_judaism', 'Иудаизм') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_catholicism', 'Католицизм') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_orthodoxy', 'Православие') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_protestantism', 'Протестантизм') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_religion', 'Религиоведение') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion', 'Религия, религиозная литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_self', 'Самосовершенствование') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_christianity', 'Христианство') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_esoterics', 'Эзотерика, эзотерическая литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('religion_paganism', 'Язычество') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Reference & Antique
INSERT INTO genres (id, name) VALUES ('geo_guides', 'Путеводители, карты, атласы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('ref_guide', 'Руководства') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('ref_dict', 'Словари') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('reference', 'Справочная литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('ref_ref', 'Справочники') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('ref_encyc', 'Энциклопедии') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('antique', 'Античность') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('antique_ant', 'Античная литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('antique_east', 'Древневосточная литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('antique_russian', 'Древнерусская литература') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('antique_european', 'Европейская старинная литература') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Technical
INSERT INTO genres (id, name) VALUES ('auto_business', 'Автодело') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('military_weapon', 'Военное дело, военная техника и вооружение') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('equ_history', 'История техники') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_metal', 'Металлургия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_radio', 'Радиоэлектроника') ON DUPLICATE KEY UPDATE name = VALUES(name);

-- SF & Fantasy (from your IMPORT_ALLOWED_GENRES - no duplicates)
INSERT INTO genres (id, name) VALUES ('asian_fantasy', 'Азиатское фэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_history', 'Историческая фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('dystopian', 'Антиутопия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_action', 'Боевая фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('boyar_anime', 'Бояръ-аниме') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('everyday_fantasy', 'Бытовая фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_heroic', 'Героическая фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_fantasy_city', 'Городское фэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('city_fantasy', 'Городское фантэзи') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_detective', 'Детективная фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('dorama', 'Дорама') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('foreign_sf', 'Зарубежная фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('historical_fantasy', 'Историческое фэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_cyberpunk', 'Киберпанк') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_space', 'Космическая фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_space_opera', 'Космическая фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_litrpg', 'ЛитРПГ') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('magic_school', 'Магическая школа') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_mystic', 'Мистика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('fairy_fantasy', 'Сказочное фэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf', 'Научная фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('nsf', 'Ненаучная фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('popadancy', 'Попаданцы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('popadanec', 'Попаданец') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('popadantsy', 'Попаданец') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('popadantsy_v_kosmos', 'Попаданец') ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO genres (id, name) VALUES ('sf_postapocalyptic', 'Постапокалипсис') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('adventure_fantasy', 'Приключенческое фэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_industrial_magic', 'Промышленная магия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_realrpg', 'РеалРПГ') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('russian_fantasy', 'Русское фэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('slavic_fantasy', 'Славянское фэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_su', 'Советская фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('modern_tale', 'Современная сказка') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_social', 'Социальная фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_stimpank', 'Стимпанк') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('dark_fantasy', 'Темное фэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_technofantasy', 'Технофэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_horror', 'Ужасы') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('utopia', 'Утопия') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_etc', 'Фантастика: прочее') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('fantasy_det', 'Фэнтезийный детектив') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_fantasy', 'Фэнтези') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('hronoopera', 'Хроноопера') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_epic', 'Эпическая фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_humor', 'Юмористическая фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sf_magic', 'Магическая фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);


INSERT INTO genres (id, name) VALUES ('unrecognised', 'Неопределен') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('sci_fi', 'Научная фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('samizdat', 'Самиздат') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO genres (id, name) VALUES ('fantasy_fight', 'Фантастика') ON DUPLICATE KEY UPDATE name = VALUES(name);