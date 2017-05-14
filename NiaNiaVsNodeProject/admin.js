/**
 * Created by Ola on 2017-04-30.
 */
var express = require("express");
var multer = require("multer");
var training = require("./models/training");
var navibar = require("./navibar.json");
var users = require("./models/user");
var specie = require("./models/specie");
var path = require("path");
var fs = require('fs');
var pokemons = require("./models/pokemon");

var router = express.Router();

var upload = multer({dest: 'pokemon_images/'});

router.use(function (req, res, next) {
    if(req.isAuthenticated()){
        if(req.user.role == 'admin'){
            next();
        }else{
            res.statusCode = 403;
            res.redirect("/403");
        }
    }else{
        res.statusCode = 401;
        res.redirect("/401")
    }
});

router.use(function (req, res, next) {
    if(req.query.method == "DELETE"){
        req.method = 'DELETE';
        req.url = req.path;
    }
    else if(req.query.method == "PATCH"){
        req.method = "PATCH";
        req.url = req.path;
    }
    else if(req.query.method == "PUT"){
        req.method = "PUT";
        req.url = req.path;
    }

    next();
});


router.get("/home", function (req, res) {
    pokemons.find({}, function (err, pokes) {
        if(err) console.log(err);
        else{
            pokemons.find({on_training: true}, function (err, pokes_on_training) {
                if(err) console.log(err);
                else{
                    users.find({}, function (err, users_in_academy) {
                        if(err) console.log(err);
                        else{
                            specie.find({}, function (err, species_in_academy) {
                                if(err) console.log(err)
                                else{
                                    training.find({}, function (err, trainings) {
                                        if(err) console.log(err);
                                        else{
                                            navibar["page"] = req.url;
                                            navibar["pokemons"] = pokes.length;
                                            navibar["on_traingind"] = pokes_on_training.length;
                                            navibar["users"] = users_in_academy.length;
                                            navibar["specie"] = species_in_academy.length;
                                            navibar['trainings'] = trainings.length;
                                            res.render("admin_home", navibar);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
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

router.use(express.static(path.resolve(__dirname, "pokemon_images")));

router.post("/add_pokemon", upload.single('file'), function (req, res) {
    var file = path.resolve(req.file.path + '.' + req.file.mimetype.split('/')[1]);

   fs.rename(req.file.path, (file), function (err) {
       if(err){
           console.log(err);
       }else{

           var newSpecie = new specie({
                 name: req.body.name,
                 photo: req.file.filename + '.' +req.file.mimetype.split('/')[1]
           });

           newSpecie.save(function (err, resp) {
                 if(err){
                     console.log(err);
                 }else{
                     res.redirect("/admin/pokemons");
                 }
             });
       }
   })
});

router.delete("/edit_pokemon/:id", function (req, res) {
    specie.findOne({_id:req.params.id}, function (err, spiece) {
        if(err){
            console.log(err);
        }else{
            fs.unlink(path.resolve("pokemon_images",spiece.photo), function () {
                spiece.remove(function (err, resp) {
                    if(err){
                        console.log(err);
                    }else{
                        res.redirect("/admin/pokemons");
                    }
                });
            });
        }
    });
});

router.get("/edit_pokemon/:id(\\w+)", function (req, res) {
    specie.findOne({_id:req.params.id}, function (err, pokemon) {
        if(err){
            console.log(err);
        }else{

            res.render("admin_edit_pokemon", {pokemon: pokemon});
        }

    })
});


router.get("/add_pokemon", function (req, res) {
    res.render("admin_add_pokemon");
});

router.get("/edit_training/:id", function (req, res) {
    training.findOne({_id:req.params.id}, function (err, training) {
        if(err){
            console.log(err);
        }else{
            res.render("edit_training", {training:training});
        }
    });
});

router.patch("/edit_training/:id", function (req, res) {
    training.findOne({_id:req.params.id}, function (err, training) {
        if(err){
            console.log(err);
        }else{
            training["name"] = req.body.name;
            training["health"] = req.body.health;
            training["agility"] = req.body.agility;
            training["attack"] = req.body.attack;
            training["defence"] = req.body.defence;
            training['duration'] = req.body.duration;

            training.save(function (err, resp) {
                if(err){
                    console.log(err);
                }else{
                    res.redirect("/admin/trainings");
                }
            });
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

router.post("/new_training", function (req, res, next) {

    var newTraining = new training({
        name:req.body.name,
        health:  req.body.health,
        agility: req.body.agility,
        attack:  req.body.attack,
        defence: req.body.defence,
        duration: req.body.duration
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

router.post("/new_admin", function (req, res, next) {

    var newUser = new users({
        username: req.body.username,
        password:  req.body.password,
        first_name: req.body.first_name,
        last_name:  req.body.last_name,
        role: "admin"
    });

    newUser.save(function (err, resp) {
        if(err){
            console.log(err);
        }else{
            // res.locals.infos("Tfuj start");
            res.redirect("/admin/users");
        }
    })

});

router.delete("/edit_user/:id", function (req, res) {
    users.findOne({_id: req.params.id}).remove(function () {
        res.redirect("/admin/users");
    });
});

router.get("/edit_user/:id", function (req, res) {
   users.findOne({_id: req.params.id}, function (err, user) {
       if(err){
           console.log(err);
       }else{
           res.render("edit_user", {user: user});
       }
   });
});

router.patch("/edit_user/:id", function (req, res) {
    users.findOne({_id: req.params.id}, function (err, user) {
        user["username"] = req.body.username;
        user["first_name"] = req.body.first_name;
        user["last_name"] = req.body.last_name;
        user["role"] = req.body.role;

        user.save(function (err, resp) {
            if(err){
                console.log(err);
            }else{
                res.redirect("/admin/users");
            }
        })
    });
});

router.get("/new_admin", function (req, res) {
    res.render("new_admin");
});

module.exports = router;