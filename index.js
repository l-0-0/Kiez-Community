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

//middleware to see which files/routes we use on the browser
app.use((req, res, next) => {
    next();
});

app.use(compression());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

const cookieSessionMiddleware = cookieSession({
    secret: "let it be.",
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
            if (!results.rows[0]) {
                res.json({
                    success: "false",
                });
            } else {
                compare(req.body.password, results.rows[0].password)
                    .then((matchValue) => {
                        req.session.userId = results.rows[0].usersId;
                        // console.log(
                        //     "does the user password match our hash in the database?",
                        //     matchValue
                        // );
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
    const secretCode = cryptoRandomString({
        length: 6,
    });

    db.getPassword(req.body.email)
        .then((results) => {
            if (results.rows[0]) {
                let to = results.rows[0].email;
                let text = secretCode;
                let subj = "Reset your password";
                db.storeTheCode(to, text)
                    .then(() => {
                        return sendEmail(to, text, subj);
                    })
                    .then(() => {
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
    db.getTheCode()
        .then((results) => {
            if (newCode === results.rows[0].code) {
                hash(pass)
                    .then((hashedPassword) => {
                        db.addTheNewPassword(email, hashedPassword)
                            .then(() => {
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
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in getting user info: ", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;

    const url = s3Url + filename;

    db.addImage(req.session.userId, url)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in addImage query: ", err);
        });
});

app.post("/bio", (req, res) => {
    db.addBio(req.session.userId, req.body.bio)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in addbio query: ", err);
        });
});

app.get("/api/user/:id", (req, res) => {
    if (req.params.id == req.session.userId) {
        res.json({
            isTheSameUser: true,
        });
    } else {
        db.userInfo(req.params.id)
            .then((results) => {
                res.json(results.rows[0]);
            })
            .catch((err) => {
                console.log("error in api/user: ", err);
            });
    }
});

app.get("/api/users", (req, res) => {
    db.getUsers()
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in users route: ", err);
        });
});

app.get("/find-people/:userInput", (req, res) => {
    db.getSearchedPeople(req.params.userInput)
        .then((results) => {
            if (results.rows.length === 0) {
                res.json({
                    success: false,
                });
            } else {
                res.json(results.rows);
                // console.log("results.rows in find people", results.rows);
            }
        })
        .catch((err) => {
            console.log("error in find people: ", err);
        });
});

app.get("/api/friendship/:viewedId", (req, res) => {
    if (req.params.viewedId == req.session.userId) {
        res.json({
            accepted: true,
        });
        return;
    }
    db.friendshipStatus(req.params.viewedId, req.session.userId)
        .then((results) => {
            res.json(results.rows[0]);
        })
        .catch((err) => {
            console.log("error in getting the friendship status", err);
        });
});

app.post("/friendship-status", (req, res) => {
    if (req.body.buttonText == "Send a friend request") {
        db.addFriend(req.body.viewedId, req.session.userId)
            .then(() => {
                res.json({
                    success: true,
                });
            })
            .catch((err) => {
                console.log("error in adding a friend", err);
            });
    } else if (req.body.buttonText == "Accept the friendship request") {
        db.acceptedFriendship(req.body.viewedId, req.session.userId)
            .then(() => {
                res.json({
                    success: true,
                });
            })
            .catch((err) => {
                console.log("error in accepting the request", err);
            });
    } else if (
        req.body.buttonText == "Cancel the friendship request" ||
        req.body.buttonText == "Put an end to this friendship"
    ) {
        db.deleteTheFriendship(req.body.viewedId, req.session.userId)
            .then(() => {
                res.json({
                    success: true,
                });
            })
            .catch((err) => {
                console.log("error in deleting the request", err);
            });
    }
});

app.get("/api/friends", (req, res) => {
    db.getFriendsAndPotentials(req.session.userId)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getting friends and wannabes: ", err);
        });
});

app.post("/end-friendship", (req, res) => {
    db.deleteTheFriendship(req.body.friendsId, req.session.userId)
        .then(() => {
            res.json({
                success: true,
            });
        })
        .catch((err) => {
            console.log("error in deleting the request", err);
        });
});

app.post("/accept-friendship", (req, res) => {
    db.acceptedFriendship(req.body.personsId, req.session.userId)
        .then(() => {
            res.json({
                success: true,
            });
        })
        .catch((err) => {
            console.log("error in accepting the request", err);
        });
});

app.get("/wall-posts/:viewedId", (req, res) => {
    db.receivePosts(req.params.viewedId)
        .then((results) => {
            res.json(results.rows);
        })
        .catch((err) => {
            console.log("error in getting the posts", err);
        });
});

app.post("/publish-post", (req, res) => {
    db.insertPosts(req.body.inputs, req.body.viewedId, req.session.userId)
        .then((results) => {
            let postMessage = results.rows[0];
            db.getChatSender(req.session.userId)
                .then((userInfo) => {
                    userInfo.rows[0].post = postMessage.post;
                    userInfo.rows[0].created_at = postMessage.created_at;
                    res.json(userInfo.rows[0]);
                })

                .catch((err) => {
                    console.log("error in get the poster by id", err);
                });
        })
        .catch((err) => {
            console.log("error in inserting the posts", err);
        });
});

app.post(
    "/post-image/:viewedId",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        const { filename } = req.file;
        const url = s3Url + filename;
        db.postImage(req.session.userId, url, req.params.viewedId)
            .then((results) => {
                let postImage = results.rows[0];
                db.getChatSender(req.session.userId)
                    .then((userInfo) => {
                        userInfo.rows[0].image = postImage.image;
                        userInfo.rows[0].created_at = postImage.created_at;
                        res.json(userInfo.rows[0]);
                    })

                    .catch((err) => {
                        console.log("error in get the poster by id", err);
                    });
            })
            .catch((err) => {
                console.log("error in post the image", err);
            });
    }
);

app.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

io.on("connection", (socket) => {
    const { userId } = socket.request.session;

    if (!userId) {
        return socket.disconnect();
    }

    db.getChats()
        .then((results) => {
            let msgs = results.rows;

            socket.emit("recentChatMessages", msgs);
        })
        .catch((err) => {
            console.log("error in getting messages: ", err);
        });

    socket.on("chatMessage", async (data) => {
        let { rows: chatRows } = await db.insertChats(data, userId);
        let { rows } = await db.getChatSender(userId);
        rows[0].message = data;
        rows[0].created_at = chatRows[0].created_at;

        io.sockets.emit("chatMessage", rows);
    });
});

server.listen(8080, function () {
    console.log("I'm listening.");
});
