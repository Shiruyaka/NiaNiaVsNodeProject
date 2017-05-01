/**
 * Created by Ola on 2017-04-30.
 */
var express = require("express");
var specie = require("./models/specie");
var training = require("./models/training");
var navibar = require("./navibar.json");
var users = require("./models/user");

var router = express.Router();


router.use(function (req, res, next) {
    if(req.isAuthenticated()){
        if(req.user.role == 'admin'){
            next();
        }else{
            res.statusCode = 403;
            res.render("403");
        }
    }else{
        res.statusCode = 401;
        res.render("401");
    }
});

router.use(function (req, res, next) {
    if(req.query.method == "DELETE"){
        req.method = 'DELETE';
        req.url = req.path;
    }
    next();
});

router.get("/home", function (req, res) {

    navibar["page"] = req.url;
    console.log(navibar);
   res.render("index", navibar);
});

router.get("/pokemons", function (req, res) {

    specie.find({}, function (err, pokemons) {
        if(err)
        { res.send(err); }
        else
        {
            navibar["page"] = req.url;
            navibar["pokemonsList"] = pokemons;

            res.render("admin_pokemons", navibar);
        }
    })
});

router.delete("/edit_training/:id", function (req, res) {
    training.find({_id: req.params.id}).remove(function () {
        res.redirect("/admin/trainings");
    });
});

router.get("/trainings", function (req, res) {
    navibar["page"] = req.url;

    training.find({}, function (err, trainings) {
        if(err){
            res.send(err);
        }else{
            navibar["trainings"] = trainings;
            res.render("admin_training", navibar);
        }
    });
});

router.get("/users", function (req, res) {
   navibar["page"] = req.url;

    users.find({}, function (err, users) {
       if(err){
           console.log(err);
       }else{
           navibar["users"] = users;
           res.render("admin_user", navibar);
       }
    });

});

router.post("/new_training", function (req, res, next) {

    var newTraining = new training({
     name:req.body.name,
     health:  req.body.health,
     agility: req.body.agility,
     attack:  req.body.attack,
     defence: req.body.defence
    });

    newTraining.save(function (err, resp) {
        if(err){
            console.log(err);
        }else{
           // res.locals.infos("Tfuj start");
            res.redirect("/admin/trainings");
        }
    })

});

router.get("/new_training", function (req, res) {
   res.render("new_training");
});

module.exports = router;