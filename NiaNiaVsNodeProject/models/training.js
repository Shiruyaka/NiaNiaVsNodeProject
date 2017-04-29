var mongoose = require("mongoose");

var trainingSchema = mongoose.Schema(
    {
        name: {type:String, required:true},
        health: {type:Integer},
        agility: {type:Integer},
        attack: {type:Integer},
        defence: {type:Integer}
    }
);

trainingSchema.find({}, function(err, docs) {
    if (!err){
        console.log(docs);
        process.exit();
    } else {throw err;}
});

var Training = mongoose.model("Training", trainingSchema);
module.exports = Training;