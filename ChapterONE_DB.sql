--espero que os comentarios ajudem

CREATE DATABASE IF NOT EXISTS ChapterONE;
USE ChapterONE;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    profile_pic VARCHAR(255),
    color_code VARCHAR(7) DEFAULT '#6366f1', --cor dos users
    created_at TIMESTAMP DEFAULT CURRENT_SERVER_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_SERVER_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_SERVER_TIMESTAMP ON UPDATE CURRENT_SERVER_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    title VARCHAR(100) NOT NULL,
    order_index INT NOT NULL, -- Para ordenar os capítulos
    content LONGTEXT, -- Conteúdo do capítulo
    created_at TIMESTAMP DEFAULT CURRENT_SERVER_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_SERVER_TIMESTAMP ON UPDATE CURRENT_SERVER_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);


--exemplos

INSERT INTO users (username, email, password_hash, color_code) VALUES 
('miguel_nobre', 'miguel@email.com', 'hash_senha_123', '#6366f1'),
('joao_silva', 'joao@email.com', 'hash_senha_456', '#10b981'),
('ana_costa', 'ana@email.com', 'hash_senha_789', '#a855f7');

INSERT INTO projects (owner_id, title, description, category) VALUES 
(1, 'um romance ai', 'mega romance de teenager.', 'Romance'),
(1, 'Diário', 'um diario de memrorias', 'Memórias'),
(2, 'Ficção Científica 101', 'O futuro da humanidade em Marte.', 'Ficção');

INSERT INTO chapters (project_id, title, order_index, content) VALUES 
(1, 'O piloto', 1, 'Era uma vez e tal'),
(1, 'A inicio', 2, 'Biel acordou e chumbou a turma toda'),
(3, 'inicio em marte', 1, 'texto sobre marte');

