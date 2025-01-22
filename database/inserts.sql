/* Εισαγωγή δεδομένων στον πίνακα operators */
INSERT INTO operators (name, email, op_id)
VALUES
    ('aegeanmotorway', 'customercare@aegeanmotorway.gr', 'AM'),
    ('egnatia','eoae@egnatia.gr','EG'),
    ('gefyra','info@gefyra.gr','GE'),
    ('kentrikiodos','customercare@kentrikiodos.gr','KO'),
    ('moreas','info@moreas.com','MO'),
    ('naodos','customercare@attikesdiadromes.gr','NAO'),
    ('neaodos','info@neaodos.gr','NO'),
    ('olympiaodos','customercare@olympiaoperation.gr','OO');

/* Εισαγωγή δεδομένων στον πίνακα tags */
INSERT INTO tags (id, tag_ref, tag_home, operator_id)
VALUES
    (1001, '001', 'HO1', 1),
    (1002, '002', 'HO2', 2),
    (1003, '003', 'HO1', 1);

/* Εισαγωγή δεδομένων στον πίνακα transactions */
INSERT INTO transactions (id, toll_id, tag_ref, timestamp, charge, settlement_id, tag_id, toll_station_id)
VALUES
    (2001, 1, '001', '2024-01-01 08:30:00', 5.00, NULL, 1001, 101),
    (2002, 2, '002', '2024-01-02 09:00:00', 7.50, NULL, 1002, 102),
    (2003, 3, '003', '2024-01-03 10:15:00', 6.25, NULL, 1003, 103);

/* Εισαγωγή δεδομένων στον πίνακα payments */
INSERT INTO payments (id, from_operator, to_operator, amount, operator_id, settlement_id)
VALUES
    (3001, 1, 2, 100.00, 1, NULL),
    (3002, 2, 1, 150.00, 2, NULL),
    (3003, 3, 1, 50.00, 3, NULL);

/* Εισαγωγή δεδομένων στον πίνακα settlements */
INSERT INTO settlements (op_id, date, id, from_operator, to_operator)
VALUES
    (1, '2024-01-05 12:00:00', 4001, 1, 2),
    (2, '2024-01-06 14:30:00', 4002, 2, 1),
    (3, '2024-01-07 16:00:00', 4003, 3, 1);
