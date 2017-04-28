var mongoose = require("mongoose");

var statisticSchema = mongoose.Schema(
    {
        id_pokemon: {type:String, required:true},
        health: {type:Integer, required:true},
        agility: {type:Integer, required:true},
        attack: {type:Integer, required:true},
        defense: {type:Integer, required:true},
        date: {type:Date, required:true}
    }
);

var Statistic = mongoose.model("Statistic", statisticSchema);
module.exports = Statistic;