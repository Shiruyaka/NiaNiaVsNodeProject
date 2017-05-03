var mongoose = require("mongoose");

var trainingSchema = mongoose.Schema(
    {
        name: {type: String, required:true},
        health: {type: Number, required:true},
        agility: {type: Number, required:true},
        attack: {type: Number, required:true},
        defence: {type: Number, required:true}
    }
);


var Training = mongoose.model("Training", trainingSchema);
module.exports = Training;