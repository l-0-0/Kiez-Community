--to run the code in terminal
--psql social_network -f sql/users.sql

DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS wall_post;
DROP TABLE IF EXISTS friendships;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS password_reset_codes;

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


CREATE TABLE password_reset_codes(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    code VARCHAR(6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE friendships( 
    id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES users(id) NOT NULL,
    recipient_id INT REFERENCES users(id) NOT NULL,
    accepted BOOLEAN DEFAULT false
);

CREATE TABLE chat_messages(
    id SERIAL PRIMARY KEY,
    message VARCHAR NOT NULL CHECK (message <> ''),
    sender_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wall_post(
    id SERIAL PRIMARY KEY,
    post VARCHAR,
    sender_id INT NOT NULL REFERENCES users(id),
    recipient_id INT NOT NULL REFERENCES users(id),
    image VARCHAR,
    link VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);