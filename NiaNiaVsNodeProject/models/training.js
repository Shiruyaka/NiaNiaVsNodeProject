var mongoose = require("mongoose");

var trainingSchema = mongoose.Schema(
    {
        name: {type: String, required:true},
        health: {type: Number},
        agility: {type: Number},
        attack: {type: Number},
        defence: {type: Number}
    }
);


var Training = mongoose.model("Training", trainingSchema);
module.exports = Training;