/**
 * Created by Ola on 2017-04-30.
 */
var express = require("express");
var specie = require("./models/specie");
var navibar = require("./navibar.json");

var router = express.Router();

router.get("/home", function (req, res) {

    navibar["page"] = req.url;
    console.log(navibar);
   res.render("index", navibar);
});

router.get("/pokemons", function (req, res) {

    console.log(navibar);
    if(req.isAuthenticated() && req.user.role == 'admin')
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

module.exports = router;