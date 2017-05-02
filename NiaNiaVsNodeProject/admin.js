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

var router = express.Router();
//
// var storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '/pokemon_images');
//     },
//     filename: function (req, file, cb) {
//         cb(null, req.body.name);
//     }
// });

// var upload = multer({storage: storage,
//                      limits:
//                          {fileSize: 4000000, files:1}
//                     });

var upload = multer({dest: '/pokemon_images/'});

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
    else if(req.query.method == "PATCH"){
        req.method = "PATCH";
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

// router.post("/add_pokemon", function (req, res) {
//
//     console.log(req);
//
//     upload(req, res, function (err) {
//         if(err){
//             console.log(err);
//         }else{
//
//             var newSpecie = new Specie({
//                 name: req.body.name
//             });
//
//             console.log(req.body.photo);
//
//             newSpecie.save(function (err, resp) {
//                 if(err){
//                     console.log(err);
//                 }else{
//                     res.redirect("/admin/pokemons");
//                 }
//             })
//         }
//     });
// });

router.post("/add_pokemon", upload.single('file'), function (req, res) {
   var file = __dirname + '/' + req.file.filename;
   fs.rename(req.file.path, file, function (err) {
       if(err){
           console.log(err);
       }else{
           console.log(req.file.filename);
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
    console.log(req.params.id);
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