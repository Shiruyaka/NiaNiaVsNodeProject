/**
 * Created by tomas on 19.04.2017.
 */
var express = require("express");
var User = require("./models/user");
var passport = require("passport");

var router = express.Router();

router.use(function (req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.errors = req.flash("error");
   res.locals.infos = req.flash("info");
   next();
});


router.get("/login", function (req, res) {
  res.render("login");
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        req.flash("info", "You must be logged in to see this page.");
        res.redirect("/login");
    }
}

router.post("/login", passport.authenticate("login",
    {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true
    }
));

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});

module.exports = router;