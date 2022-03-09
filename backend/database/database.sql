CREATE DATABASE bd_proyecto_foto;

USE bd_proyecto_foto;

CREATE TABLE user(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(50),
    password VARCHAR(200),
    token VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);