const express = require("express");
const router = express.Router();
const passport = require("passport");

const auth = require("../middleware/auth");
const protectedRouter = require("../middleware/protectedRouter");

router.get("/login", [protectedRouter], (req, res) => {
        return res.render("login.ejs", { pageTitle: "Login | APMS", page: req.page });
});

router.get("/register", [protectedRouter], (req, res) => {
        res.render("register.ejs", { pageTitle: "Register | APMS", page: req.page });
});

router.get("/changePassword", [auth], (req, res) => {
        res.render("changePassword.ejs", { pageTitle: "Change password | APMS", page: req.page });
});

router.get("/delete", [auth], (req, res) => {
        res.render("deleteUser.ejs", { pageTitle: "Delete Account | APMS", page: req.page });
});

router.get("/logout", [auth], (req, res) => {
        delete req.session.passport;
        res.redirect("/home");
});

//----------Google---------//
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/user/login" }), function (req, res) {
        res.redirect("/home");
});

//----------Facebook----------; //
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/user/login" }), function (req, res) {
        // Successful authentication, redirect home.

        res.redirect("/home");
});

module.exports = router;
