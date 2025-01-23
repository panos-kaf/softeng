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

INSERT INTO tags (tag_ref, tag_home, operator_id)
VALUES
    ('NAO01', 'NAO', 1),
    ('OO44', 'OO', 8),
    ('NAO23', 'NAO', 1);

INSERT INTO transactions (charge, timestamp, tag_id, toll_station_id)
VALUES
    (5.00, '2024-01-01 08:30:00', 1, 101),
    (7.50, '2024-01-02 09:00:00', 2, 102),
    (6.25, '2024-01-03 10:15:00', 1, 103);

INSERT INTO payments (from_operator, to_operator, amount, operator_id)
VALUES
    (1, 2, 100.00, 1),
    (2, 1, 150.00, 2),
    (3, 1, 50.00, 3);

INSERT INTO settlements (op_id, date, from_operator, to_operator)
VALUES
    (1, '2024-01-05 12:00:00', 1, 2),
    (2, '2024-01-06 14:30:00', 2, 1),
    (3, '2024-01-07 16:00:00', 3, 1);
