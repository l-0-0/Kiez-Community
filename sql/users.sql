--to run the code in terminal
--psql social_network -f sql/users.sql

DROP TABLE IF EXISTS users;

CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      first VARCHAR(255) NOT NULL CHECK (first != ''),
      last VARCHAR(255) NOT NULL CHECK (last != ''),
      email VARCHAR(255) NOT NULL UNIQUE CHECK (email != ''),
      password VARCHAR(255) NOT NULL CHECK (password != ''),
      bio VARCHAR,
      profile_pic VARCHAR,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
