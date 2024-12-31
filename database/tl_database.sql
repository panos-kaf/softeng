CREATE DATABASE tl_database;
USE tl_database;

/* Users */
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

/* Table: operators */
CREATE TABLE operators (
    id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    adm INT,
    op_id VARCHAR(3)
);

/* Table: toll_stations */
CREATE TABLE toll_stations (
    id INT PRIMARY KEY,
    road VARCHAR(255),
    locality VARCHAR(255),
    lat NUMERIC,
    lon NUMERIC,
    station_id VARCHAR(6),
    operator_id INT,
    CONSTRAINT fk_toll_stations_operators FOREIGN KEY (operator_id) REFERENCES operators(id)
);

/* Table: tags */
CREATE TABLE tags (
    id INT PRIMARY KEY,
    tag_ref VARCHAR(20) NOT NULL,
    tag_home VARCHAR(3),
    operator_id INT,
    CONSTRAINT fk_tags_operators FOREIGN KEY (operator_id) REFERENCES operators(id)
);

/* Table: transactions */
CREATE TABLE transactions (
    id INT PRIMARY KEY,
    toll_id INT,
    tag_ref VARCHAR(20),
    timestamp TIMESTAMP NOT NULL,
    charge NUMERIC(10, 2),
    settlement_id INT,
    tag_id INT,
    toll_station_id INT,
    CONSTRAINT fk_transactions_tags FOREIGN KEY (tag_id) REFERENCES tags(id),
    CONSTRAINT fk_transactions_toll_stations FOREIGN KEY (toll_station_id) REFERENCES toll_stations(id)
);

/* Table: payments */
CREATE TABLE payments (
    id INT PRIMARY KEY,
    from_operator INT,
    to_operator INT,
    amount NUMERIC(10, 2),
    operator_id INT,
    settlement_id INT,
    CONSTRAINT fk_payments_from_operator FOREIGN KEY (from_operator) REFERENCES operators(id),
    CONSTRAINT fk_payments_to_operator FOREIGN KEY (to_operator) REFERENCES operators(id),
    CONSTRAINT fk_payments_settlement FOREIGN KEY (settlement_id) REFERENCES settlements(id)
);

/* Table: settlements */
CREATE TABLE settlements (
    op_id INT,
    date TIMESTAMP NOT NULL,
    id INT PRIMARY KEY,
    from_operator INT,
    to_operator INT,
    CONSTRAINT fk_settlements_from_operator FOREIGN KEY (from_operator) REFERENCES operators(id),
    CONSTRAINT fk_settlements_to_operator FOREIGN KEY (to_operator) REFERENCES operators(id)
);
