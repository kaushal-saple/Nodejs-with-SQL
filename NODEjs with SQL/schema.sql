

CREATE TABLE user(
	id INT PRIMARY KEY,
    username VARCHAR(20) UNIQUE,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL
);

