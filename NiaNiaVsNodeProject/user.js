var express = require("express");
var ObjectID = require('mongodb').ObjectID;
var mongoose = require("mongoose");
var navibar = require("./user_navibar.json");
var pokemons = require("./models/pokemon");
var trainings = require("./models/training");
var species = require("./models/specie");
var statistics = require("./models/statistic");
var path = require("path");
var router = express.Router();
var schedule = require("./models/schedule");

router.use(function (req, res, next) {
    if(req.isAuthenticated()){
        if(req.user.role == 'user'){
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

    next();
});

router.post("/home/:id_poke/:id_train", function (req, res) {
    schedule.remove({id_pokemon: req.params.id_poke}, function (err) {
        if(err){
            console.log(err);
        }else{
            console.log('usunięto');
        }
    });

    trainings.findOne({_id:req.params.id_train}, function (err, training) {
        if(err) {
            console.log(err)
        }else{
            statistics.findOne({id_pokemon: req.params.id_poke}).sort({date: -1}).limit(1).exec(function (err, stats) {
                if(err){
                    console.log(err);
                }
                else{
                    var new_stats = new statistics({
                        id_pokemon: req.params.id_poke,
                        health: training.health + stats.health,
                        agility: training.agility + stats.agility,
                        attack: training.attack + stats.attack,
                        defense: training.defence + stats.defense,
                        date: new Date()
                    });

                    new_stats.save(function (err) {
                        if(err){
                            console.log(err)
                        }else{
                            pokemons.findOne({_id:req.params.id_poke}, function (err, poke) {
                                if(err){
                                    console.log(err);
                                }else{
                                    poke.on_training = false;
                                    poke.save(function (err) {
                                        if(err) {
                                            console.log(err);
                                        }
                                    });



                                    res.redirect("/user/home");
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

router.get("/home", function (req, res) {
    navibar["page"] = req.url;
    pokemons.find({on_training: true, id_user: req.user._id}, function (err, pokes) {
        if(err){
            console.log(err);
        }else{

            var ides = [];

            for(var i=0; i<pokes.length; i++){
                ides.push(pokes[i]._id.toString());
            }

            schedule.find({id_pokemon: {$in: ides}}, function (err, result) {
                if(err){
                    console.log(err);
                }else{
                    console.log(result);
                    navibar["page"] = req.url;
                    navibar["pokemons"] = result;
                    res.render("user_home", navibar);
                }
            })
        }
    });
});

router.use(express.static(path.resolve(__dirname, "pokemon_images")));

router.get("/pokemons", function (req, res) {

    pokemons.find({id_user: req.user._id}, function (err, pokes) {
        if(err){
            console.log(err);
        }else{
            navibar["page"] = req.url;
            navibar["pokemons"] = pokes;
            res.render("user_pokemons", navibar);
        }
    });
});

router.get("/detail_pokemon/:id(\\w+)", function (req, res) {

    pokemons.findOne({_id: req.params.id}, function (err, pokemon) {
        if(err){
            console.log(err);
        }
        else{
            navibar["pokemon"] = pokemon;
            species.findOne({name: navibar["pokemon"].specie}, function (err, sp) {
                if(err){
                    console.log(err);
                }
                else{
                    navibar['sp'] = sp;

                    statistics.findOne({id_pokemon: navibar["pokemon"]._id}).sort({date: -1}).limit(1).exec(function (err, stats) {
                        if(err){
                            console.log(err);
                        }
                        else{

                            navibar["page"] = req.url;
                            navibar['stats'] = stats;
                            res.render("user_pokemon_detail", navibar);
                        }
                    });
                }
            });
        }
    });
});

router.get("/new_pokemon", function (req, res) {

    species.find({}, function (err, specie) {
        if(err){
            console.log(err);
        }else{
            res.render("user_new_pokemon", {specie: specie});
        }
    })
});

router.post("/new_pokemon", function (req, res, next) {

    var newPokemon = new pokemons({
        name: req.body.name,
        specie:  req.body.sp,
        id_user: req.user._id,
        on_training: false
    });

    var new_Stats = new statistics({
        id_pokemon: newPokemon._id,
        health: Math.floor((Math.random() * 10) + 1),
        agility: Math.floor((Math.random() * 10) + 1),
        attack: Math.floor((Math.random() * 10) + 1),
        defense: Math.floor((Math.random() * 10) + 1),
        date: new Date()
    });

    new_Stats.save(function (err, resp) {
        if(err){
            console.log(err)
        }
        else{
            newPokemon.save(function (err, resp) {
                if(err){
                    console.log(err);
                }else{
                    res.redirect("/user/pokemons");
                }
            });
        }
    });
});


router.delete("/pokemon_detail/:id", function (req, res) {
    pokemons.find({_id: req.params.id}).remove(function () {
        res.redirect("/user/pokemons");
    });
});

router.get("/trainings", function (req, res) {
    navibar["page"] = req.url;

    pokemons.find({id_user: req.user._id, on_training: false}, function (err, pokes) {
        if(err){
            console.log(err);
        }else{
            navibar["page"] = req.url;
            navibar["pokemons"] = pokes;
            trainings.find({}, function (err, trainings) {

                if(err){
                    console.log(err)
                }else{
                    navibar["trainings"] = trainings;
                    res.render("user_trainings", navibar);
                }
            });
        }
    });
});

router.post("/trainings", function (req, res){
    if(req.body.optradio && req.body.pokemon){
        trainings.findOne({_id: req.body.optradio}, function (err, training) {

            pokemons.findOne({_id: req.body.pokemon}, function (err, pokemon_to_name) {
                if(err) console.log(err);
                else{
                    var date = new Date();
                    var newSchedule = new schedule({
                        id_pokemon: req.body.pokemon,
                        id_training: req.body.optradio,
                        end_date: new Date(date.getTime() + (60 * 1000 * training.duration)),
                        pokemon_name: pokemon_to_name.name
                    });

                    newSchedule.save(function (err) {
                        if(err){
                            console.log(err)
                        }else{
                            pokemons.findOne({_id:req.body.pokemon}, function (err, poke) {
                                poke.on_training = true;
                                poke.save(function (err) {
                                    if(err) {
                                        console.log(err);
                                    }
                                });
                                req.flash("info", "Your pokemon is on training");
                                res.redirect("/user/trainings");
                            })
                        }
                    });
                }
            });
        });
    }
});

module.exports = router;