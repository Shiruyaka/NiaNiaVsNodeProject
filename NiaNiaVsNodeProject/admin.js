/**
 * Created by Ola on 2017-04-30.
 */
var express = require("express");
var specie = require("Specie");

var router = express.Router();

app.get("pokemons", function (req, rest, next) {
    specie.find({}, function (err, pokemons) {
        if(err)
            res.send(err);

        res.render("admin_pokemons", {pokemonsList: pokemons})
    })
});