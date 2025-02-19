CREATE DATABASE softeng;
USE softeng;

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
    op_id VARCHAR(4) NOT NULL UNIQUE, 
    name VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE toll_stations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    toll_id VARCHAR(10) UNIQUE, -- Add unique constraint to TollID
    name VARCHAR(255),
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
    tag_ref VARCHAR(20) NOT NULL UNIQUE,
    operator_id INT,
    CONSTRAINT fk_tags_operators FOREIGN KEY (operator_id) REFERENCES operators(id)
);

CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    timestamp TIMESTAMP NOT NULL,
    charge NUMERIC(10, 2) NOT NULL,
    tag_id INT,
    toll_station_id INT,
    CONSTRAINT fk_transactions_tags FOREIGN KEY (tag_id) REFERENCES tags(id),
    CONSTRAINT fk_transactions_toll_stations FOREIGN KEY (toll_station_id) REFERENCES toll_stations(id)
);

CREATE TABLE settlements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    amount NUMERIC(10, 2) NOT NULL,
    date TIMESTAMP NOT NULL,
    from_operator INT NOT NULL,
    to_operator INT NOT NULL,
    is_paid BOOLEAN DEFAULT FALSE,
    payment_date TIMESTAMP NULL,
    CONSTRAINT fk_settlements_from_operator FOREIGN KEY (from_operator) REFERENCES operators(id),
    CONSTRAINT fk_settlements_to_operator FOREIGN KEY (to_operator) REFERENCES operators(id)
);