CREATE DATABASE ChapterONE;
USE ChapterONE;

CREATE TABLE Users (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(256) NOT NULL,
    RegistrationDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Projects (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(200) NOT NULL,
    Description TEXT,
    CreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    OwnerId INT NOT NULL, -- posso acabar por mudar por causa do admin
    FOREIGN KEY (OwnerId) REFERENCES Users(Id)
);

CREATE TABLE ProjectCollaborators (
    ProjectId INT NOT NULL,
    UserId INT NOT NULL,
    Role VARCHAR(50) NOT NULL, -- 'editor' , 'viewer' ou 'admin'
    PRIMARY KEY (ProjectId, UserId),
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE,
    FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE
);

-- Tabela Chapters
CREATE TABLE Chapters (
    Id INT PRIMARY KEY AUTO_INCREMENT,
    ProjectId INT NOT NULL,
    Title VARCHAR(200) NOT NULL,
    `Order` INT NOT NULL, -- Usar crases para 'Order' pois é uma palavra reservada
    FOREIGN KEY (ProjectId) REFERENCES Projects(Id) ON DELETE CASCADE
);

-- Inserir alguns dados de exemplo (opcional)
INSERT INTO Users (Username, Email, PasswordHash) VALUES
('Nobre', 'miguel.nobre@example.com', 'password123');

INSERT INTO Projects (Title, Description, OwnerId) VALUES
('Misfits', 'Couples of those who didnt want to be nobodys', 1);

INSERT INTO ProjectCollaborators (ProjectId, UserId, Role) VALUES -- exemplo pra depois
(1, 2, 'Viewer');

INSERT INTO Chapters (ProjectId, Title, `Order`) VALUES
(1, 'O Despertar', 1),
(1, 'A Jornada', 2),
(2, 'Pequeno Almoço', 1),
(2, 'Almoço', 2);