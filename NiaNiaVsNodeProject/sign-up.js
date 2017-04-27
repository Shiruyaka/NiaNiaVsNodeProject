/**
 * Created by tomas on 21.04.2017.
 */
var express = require("express");
var User = require("./models/user");
var path = require("path");
var passport = require("passport");
var router = express.Router();

router.get("/signup", function (req, res) {
    res.render("sign-up");
});

router.post("/signup", function (req, res, next) {

    var username = req.body.username;
    var password = req.body.password;
    var first_name = req.body.first_name;
    var last_name = req.body.last_name;

    User.findOne({username: username}, function (err, user) {

        if (err) {
            return next(err);
        }
        if (user) {
            req.flash("error", "User already exists");
            return res.redirect("/signup");
        }

        var newUser = new User({
            username: username,
            password: password,
            first_name: first_name,
            last_name: last_name
        });

        newUser.save(function (err, resp) {
            if(err){
                console.log(err);
            } else{
                console.log("is ok");
                next();
            }
        });
    });
}, passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "/signup",
    failureFlash   : true
}));

module.exports = router;