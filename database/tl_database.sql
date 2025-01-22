CREATE DATABASE tl_database;
USE tl_database;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE operators (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    op_id VARCHAR(4) UNIQUE 
);

CREATE TABLE toll_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    toll_id VARCHAR(10) UNIQUE, -- Add unique constraint to TollID
    road VARCHAR(255),
    locality VARCHAR(255),
    lat DECIMAL(7, 5),
    lon DECIMAL(7, 5),
    price1 DECIMAL(10, 2),
    price2 DECIMAL(10, 2),
    price3 DECIMAL(10, 2),
    price4 DECIMAL(10, 2),
    operator_id INT,
    email VARCHAR(255),
    CONSTRAINT fk_toll_stations_operators FOREIGN KEY (operator_id) REFERENCES operators(id)
);

CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag_ref VARCHAR(20) NOT NULL,
    tag_home VARCHAR(3),
    operator_id INT,
    CONSTRAINT fk_tags_operators FOREIGN KEY (operator_id) REFERENCES operators(id)
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
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

CREATE TABLE settlements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    op_id INT,
    date TIMESTAMP NOT NULL,
    from_operator INT,
    to_operator INT,
    CONSTRAINT fk_settlements_from_operator FOREIGN KEY (from_operator) REFERENCES operators(id),
    CONSTRAINT fk_settlements_to_operator FOREIGN KEY (to_operator) REFERENCES operators(id)
);

CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    from_operator INT,
    to_operator INT,
    amount NUMERIC(10, 2),
    operator_id INT,
    settlement_id INT,
    CONSTRAINT fk_payments_from_operator FOREIGN KEY (from_operator) REFERENCES operators(id),
    CONSTRAINT fk_payments_to_operator FOREIGN KEY (to_operator) REFERENCES operators(id),
    CONSTRAINT fk_payments_settlement FOREIGN KEY (settlement_id) REFERENCES settlements(id)
);
