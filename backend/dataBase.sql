CREATE database if not exists messenger;
use messenger;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(255) DEFAULT 'assets/avatar-1.png'
);

alter table users
modify avatar varchar(2);

CREATE TABLE IF NOT EXISTS dialogs (
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_group BOOLEAN NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dialog_members (
	id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    dialog_id INT NOT NULL,
    CONSTRAINT fk_USER_DIALOG_MEMBERS FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_DIALOG_DIALOG_MEMBERS FOREIGN KEY (dialog_id) REFERENCES dialogs(id)
);

CREATE TABLE IF NOT EXISTS messages (
	id INT AUTO_INCREMENT PRIMARY KEY,
    dialog_id INT NOT NULL,
    sender_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_MESSAGES_DIALOGS FOREIGN KEY (dialog_id) REFERENCES dialogs(id),
	CONSTRAINT fk_MESSAGES_users FOREIGN KEY (sender_id) REFERENCES users(id)
);