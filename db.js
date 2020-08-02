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

// module.exports.checkEmail = function (email) {
//     let q = "SELECT * FROM users WHERE email = $1 ";
//     let params = [email];
//     return db.query(q, params);
// };

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
    let q = `UPDATE users SET password = $2 WHERE email = $1;`;
    let params = [email, hashedPassword];
    return db.query(q, params);
};

module.exports.userInfo = function (id) {
    let q = `SELECT id, first, last, profile_pic FROM users WHERE id=$1`;
    let params = [id];
    return db.query(q, params);
};
