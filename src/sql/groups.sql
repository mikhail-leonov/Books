INSERT INTO groups (id, name) VALUES (1, 'Potter') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO groups (id, name) VALUES (2, 'Содружество') ON DUPLICATE KEY UPDATE name = VALUES(name);
INSERT INTO groups (id, name) VALUES (3, 'Stulchick') ON DUPLICATE KEY UPDATE name = VALUES(name);
 
