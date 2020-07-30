const express = require("express");
const db = require("./db");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bc");

const compression = require("compression");

const app = express();

app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.use(
    cookieSession({
        secret: "let it be.",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
app.use(express.json());
//it has to be after cookie session and urlencoded
app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//----FILE UPLOAD BOILERPLATE-----//
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const { promises } = require("fs");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

//-----------------------------//

app.get("/welcome", function (req, res) {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/register", (req, res) => {
    hash(req.body.password)
        .then((hashedPw) => {
            db.register(
                req.body.firstName,
                req.body.lastName,
                req.body.email,
                hashedPw
            )
                .then((results) => {
                    // console.log("hashed user password:", hashedPw);
                    // console.log(results.rows[0]);
                    req.session.userId = results.rows[0].id;
                    req.session.success = "true";
                    res.json({
                        success: "true",
                    });
                })
                .catch((err) => {
                    console.log("error in hash in POST register", err);
                    res.json({
                        success: "false",
                    });
                });
        })
        .catch((err) => {
            console.log("error in send the info in POST register", err);
        });
});

app.post("/login", (req, res) => {
    db.getPassword(req.body.email)
        .then((results) => {
            // console.log(req.body.email, results.rows[0].password);
            if (!results.rows[0]) {
                res.json({
                    success: "false",
                });
            } else {
                // console.log(req.body.password, results.rows[0].password);
                compare(req.body.password, results.rows[0].password)
                    .then((matchValue) => {
                        console.log(
                            "does the user password match our hash in the database?",
                            matchValue
                        );
                        if (matchValue) {
                            req.session.userId = results.rows[0].usersId;
                            res.jeson({ success: "true" });
                        } else {
                            res.json({
                                success: "false",
                            });
                        }
                    })
                    .catch((err) => {
                        console.log("error in maching the password", err);
                        res.json({
                            success: "false",
                        });
                    });
            }
        })
        .catch((err) => {
            console.log("error in getting the email and password", err);
            res.json({
                success: "false",
            });
        });
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
