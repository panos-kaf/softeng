/* Εισαγωγή δεδομένων στον πίνακα operators */
INSERT INTO operators (id, name, email, adm, op_id)
VALUES
    (1, 'Operator A', 'operatorA@example.com', 1, 'OP1'),
    (2, 'Operator B', 'operatorB@example.com', 0, 'OP2'),
    (3, 'Operator C', 'operatorC@example.com', 1, 'OP3');

/* Εισαγωγή δεδομένων στον πίνακα toll_stations */
INSERT INTO toll_stations (id, road, locality, lat, lon, station_id, operator_id)
VALUES
    (101, 'Main Road', 'City A', 40.7128, -74.0060, 'TS101', 1),
    (102, 'Highway 1', 'City B', 34.0522, -118.2437, 'TS102', 2),
    (103, 'Route 66', 'City C', 41.8781, -87.6298, 'TS103', 1);

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
