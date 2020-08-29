const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const pageRender = require("../middleware/pageRender");
const userAPI = require("../router/usersAPI.router");
const user = require("../router/users.router");
const residentAPI = require("../router/residentsAPI.router");
const resident = require("../router/residents.router");
const cookieParser = require("cookie-parser");

const userToken = new MongoDbStore({
        uri: process.env.DB_URL,
        collection: "token",
});

module.exports = function (app) {
        app.use(express.json());
        app.use(cors());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(cookieParser());
        app.use(
                session({
                        secret: process.env.SECRET_SESSION_KEY,
                        resave: true,
                        saveUninitialized: false,
                        store: userToken,
                        name: "token",
                        cookie: {
                                maxAge: 2 * 3600 * 24,
                                secure: false,
                        },
                })
        );
        app.use(passport.initialize());
        app.use(passport.session());
        app.set("view engine", "ejs");
        app.set("views", path.join(__dirname, "../views"));
        app.use(express.static(path.join(__dirname, "../public")));
        //--------------Router--------//
        app.use(pageRender);

        app.use("/user", user);
        app.use("/api/user", userAPI);

        app.use("/resident", resident);
        app.use("/api/resident", residentAPI);

        app.get("/home", (req, res) => {
                console.log(req.session);
                console.log(req.page);
                res.render("home.ejs", { pageTitle: "Home | APSM", page: req.page });
        });

        app.use("/", (req, res) => {
                res.redirect("/home");
        });
        //---------------------------//
};
