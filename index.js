const express = require("express");
const db = require("./db");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const { hash, compare } = require("./bc");
const { sendEmail } = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3");
const { s3Url } = require("./config");

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
            // console.log("result", req.body.email, results.rows[0].password);
            if (!results.rows[0]) {
                res.json({
                    success: "false",
                });
            } else {
                console.log(req.body.password, results.rows[0].password);
                compare(req.body.password, results.rows[0].password)
                    .then((matchValue) => {
                        req.session.userId = results.rows[0].usersId;
                        console.log(
                            "does the user password match our hash in the database?",
                            matchValue
                        );
                        if (matchValue) {
                            req.session.userId = results.rows[0].id;
                            req.session.success = "true";
                            res.json({
                                success: "true",
                            });
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

app.post("/reset-password", (req, res) => {
    //     const { id } = req.params;
    //     const results = await db.checkEmail(id);
    //     console.log(results.rows);

    //     if (id === req.session.userId) {
    //         console.log("i#m already a user");
    //     } else {
    //         console.log("you're a lier");
    //     }
    // });
    const secretCode = cryptoRandomString({
        length: 6,
    });

    db.getPassword(req.body.email)
        .then((results) => {
            // console.log("result", results.rows[0]);

            if (results.rows[0]) {
                console.log("i#m already a user");

                let to = results.rows[0].email;
                let text = secretCode;
                let subj = "Reset your password";
                db.storeTheCode(to, text)
                    .then(() => {
                        return sendEmail(to, text, subj);
                    })
                    .then(() => {
                        // console.log("results send email: ", results);
                        res.json({
                            success: "true",
                        });
                    })
                    .catch((err) => {
                        console.log("error in send email: ", err);
                    })
                    .catch((err) => {
                        console.log("error in sending the email ", err);
                        res.json({
                            success: "false",
                        });
                    });
            } else {
                console.log("you're a lier");
                res.json({
                    success: "false",
                });
            }
        })
        .catch((err) => {
            console.log("error in getting the email ", err);
        });
});

app.post("/new-password", (req, res) => {
    let newCode = req.body.code;
    let email = req.body.email;
    let pass = req.body.password;
    // console.log(
    //     "code before db: ",
    //     req.body.code,
    //     req.body.email,
    //     req.body.password
    // );
    db.getTheCode()
        .then((results) => {
            // console.log("code: ", results.rows[0]);
            if (newCode === results.rows[0].code) {
                // console.log("it's working: ", results.rows[0]);
                hash(pass)
                    .then((hashedPassword) => {
                        db.addTheNewPassword(email, hashedPassword)
                            .then(() => {
                                // console.log(
                                //     "hashed user password:",
                                //     hashedPassword
                                // );

                                req.session.success = "true";
                                res.json({
                                    success: "true",
                                });
                            })
                            .catch((err) => {
                                console.log(
                                    "error in hash in POST register",
                                    err
                                );
                                res.json({
                                    success: "false",
                                });
                            });
                    })
                    .catch((err) => {
                        console.log(
                            "error in send the info in POST add new password",
                            err
                        );
                    });
            }
        })
        .catch((err) => {
            console.log("error in new password", err);
        });
});

app.get("/user", (req, res) => {
    db.userInfo(req.session.userId)
        .then((results) => {
            // console.log("user info: ", results.rows[0]);

            res.json(
                results.rows[0]
                // success: "true",
            );
        })
        .catch((err) => {
            console.log("error in getting user info: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    // console.log("file:", req.file);

    const url = s3Url + filename;

    db.addImage(req.session.userId, url)
        .then((results) => {
            // console.log("results.rows:", results.rows[0]);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in addImage query: ", err);
        });
});

app.post("/bio", (req, res) => {
    db.addBio(req.session.userId, req.body.bio)
        .then((results) => {
            // console.log("results.rows:", results.rows[0]);
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in addbio query: ", err);
        });
});

app.get("/api/user/:id", (req, res) => {
    // type of params.id and session.id is different. one is a number and one is a string. so when I put
    //=== in my if statement, it doesn't work!
    // console.log("req.params.id: ", typeof req.params.id);
    // console.log("req.session: ", typeof req.session.userId);
    if (req.params.id == req.session.userId) {
        res.json({
            isTheSameUser: true,
        });
    } else {
        db.userInfo(req.params.id)
            .then((results) => {
                console.log("results in api/user: ", results.rows[0]);
                res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("error in api/user: ", err);
            });
    }
});

app.get("/logout", (req, res) => {
    req.session.userId = null;
    console.log("your're logged out");
    res.redirect("/");
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
