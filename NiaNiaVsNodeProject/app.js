/**
 * Created by tomas on 19.04.2017.
 */

var express = require("express");
var mongoose = require("mongoose");
var path = require("path");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var flash = require("connect-flash");
var passport = require("passport");
var setUpPassport = require("./set_up_passport");
var logger = require("morgan");
var signup = require("./sign-up");
var routes = require("./utils");
var Training = require("./models/training");
var admin = require("./admin");
var user = require("./user");
var pokemons = require("./models/pokemon");
var users = require("./models/user");
var crypto = require("crypto");
var profil = require("./profil");

var app = express();
mongoose.connect("mongodb://localhost:27017/pokemonAcademy");


setUpPassport();


app.set("port", 3001);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
    secret: "b1bf814e4cde5bcbf5bdaf6ece05f80034e844a72017b3b60ace6c14d07d91d0",
    resave: true,
    saveUninitialized: true
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use(signup);

app.use(function (req, res, next) {
    if(req.query.method == "PATCH"){
        req.method = "PATCH";
        req.url = req.path;
    }

    next();
});

app.get("/", function (req, res) {
    if(req.isAuthenticated()){
        res.redirect("/" + req.user.role + "/" + "home");
    }else{
        res.render("index");
    }
});



app.use("/admin", admin);
app.use("/user", user);
app.use("/profile", profil);
//var photoPath = path.resolve(__dirname, "offensive-photos-folder");
//app.use("/offensive", express.static(photoPath));

app.use(express.static(path.resolve(__dirname, "images")));

app.get("/401", function (req, res) {
    res.statusCode = 401;
    res.render("401");
});

app.get("/403", function (req, res) {
    res.statusCode = 403;
    res.render("403");
});

app.use(function (req, res) {
    res.statusCode = 404;
    res.render("404");
});

app.listen(app.get("port"), function () {
   console.log("Server is started on port" + app.get("port"));
});

