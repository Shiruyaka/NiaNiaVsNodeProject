var express = require("express");
var navibar = require("./user_navibar.json");
var pokemons = require("./models/pokemon");
var trainings = require("./models/training");
var species = require("./models/specie");
var statistics = require("./models/statistic");
var path = require("path");
var router = express.Router();

router.use(function (req, res, next) {
    if(req.isAuthenticated()){
        if(req.user.role == 'user'){
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
    res.render("index", navibar);
});

router.use(express.static(path.resolve(__dirname, "pokemon_images")));

router.get("/pokemons", function (req, res) {

    pokemons.find({id_user: req.user._id, on_training: false}, function (err, pokes) {
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

                    statistics.find({id_pokemon: navibar["pokemon"]._id}).sort({date: 1}).limit(1).exec(function (err, stats) {
                        if(err){
                            console.log(err);
                        }
                        else{

                            navibar["page"] = req.url;
                            navibar['stats'] = stats[0];
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
    });

    newPokemon.save(function (err, resp) {
        if(err){
            console.log(err);
        }else{
            res.redirect("/user/pokemons");
        }
    })
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

module.exports = router;