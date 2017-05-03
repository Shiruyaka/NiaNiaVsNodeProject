var mongoose = require("mongoose");

var statisticSchema = mongoose.Schema(
    {
        id_pokemon: {type:String, required:true},
        health: {type:Number, required:true},
        agility: {type:Number, required:true},
        attack: {type:Number, required:true},
        defense: {type:Number, required:true},
        date: {type:Date, required:true}
    }
);

var Statistic = mongoose.model("Statistic", statisticSchema);
module.exports = Statistic;