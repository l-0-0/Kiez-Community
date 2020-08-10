const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:Hoda@localhost:5432/social_network"
);

module.exports.register = function (firstName, lastName, email, password) {
    let q =
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id";
    let params = [firstName, lastName, email, password];
    return db.query(q, params);
};

module.exports.getPassword = function (email) {
    let q = "SELECT * FROM users WHERE email = $1";
    let params = [email];
    return db.query(q, params);
};

module.exports.storeTheCode = function (email, code) {
    let q = `INSERT INTO password_reset_codes (email, code) VALUES ($1, $2) RETURNING *`;
    let params = [email, code];
    return db.query(q, params);
};

module.exports.getTheCode = function () {
    let q = `SELECT * FROM password_reset_codes
            WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`;
    return db.query(q);
};

module.exports.addTheNewPassword = function (email, hashedPassword) {
    let q = `UPDATE users SET password = $2 WHERE email = $1`;
    let params = [email, hashedPassword];
    return db.query(q, params);
};

module.exports.userInfo = function (id) {
    let q = `SELECT id, first, last, bio, profile_pic FROM users WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};

module.exports.addImage = (id, url) => {
    let q = `UPDATE users SET profile_pic = $2 WHERE id=$1 RETURNING profile_pic`;
    let params = [id, url];
    return db.query(q, params);
};

module.exports.addBio = (id, bio) => {
    let q = `UPDATE users SET bio = $2 WHERE id=$1 RETURNING bio`;
    let params = [id, bio];
    return db.query(q, params);
};

module.exports.getUsers = () => {
    let q = `SELECT * FROM users ORDER BY id DESC LIMIT 3`;
    return db.query(q);
};

module.exports.getSearchedPeople = (input) => {
    let q = `SELECT first, last, profile_pic, id FROM users WHERE first ILIKE $1 OR last ILIKE $1`;
    let params = [input + "%"];
    return db.query(q, params);
};

module.exports.friendshipStatus = (viewedId, userId) => {
    let q = `SELECT * FROM friendships
  WHERE (recipient_id = $1 AND sender_id = $2)
  OR (recipient_id = $2 AND sender_id = $1)`;
    let params = [viewedId, userId];
    return db.query(q, params);
};

module.exports.addFriend = (viewedId, userId) => {
    let q = `INSERT INTO friendships (recipient_id, sender_id) VALUES ($1, $2) `;
    let params = [viewedId, userId];
    return db.query(q, params);
};

module.exports.acceptedFriendship = (viewedId, userId) => {
    let q = `UPDATE friendships SET accepted='true' WHERE recipient_id=$2 AND sender_id=$1  `;
    let params = [viewedId, userId];
    return db.query(q, params);
};
module.exports.deleteTheFriendship = (viewedId, userId) => {
    let q = `DELETE FROM friendships WHERE 
    (recipient_id=$1 AND sender_id=$2) OR 
    (recipient_id = $2 AND sender_id = $1) `;
    let params = [viewedId, userId];
    return db.query(q, params);
};

module.exports.getFriendsAndPotentials = (userId) => {
    let q = `SELECT users.id, first, last, profile_pic, accepted
            FROM friendships JOIN users
            ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
            OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
            OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`;
    let params = [userId];
    return db.query(q, params);
};
