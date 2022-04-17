CREATE DATABASE bd_proyecto_foto;

USE bd_proyecto_foto;

CREATE TABLE users(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user VARCHAR(50),
    password VARCHAR(200),
    token VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, user, token, created_at) VALUES
(1, 'lucas.cardemil', '$2a$10$FWr4KGO/spENw5vXpoquwO63ZNNYL9t4mSCIxGR.JG1m.aI9bsyuK', '2022-03-17 17:01:47');

CREATE TABLE groups(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE photos(
    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_group int(11) NOT NULL,
    price INT(11),
    description VARCHAR(255),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE photos
  ADD CONSTRAINT id_group FOREIGN KEY (id_group) REFERENCES groups (id) ON DELETE CASCADE;
COMMIT;