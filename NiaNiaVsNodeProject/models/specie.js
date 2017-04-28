var mongoose = require("mongoose");

var specieSchema = mongoose.Schema(
    {
        name: {type:String, unique:true},
        photo: {type:String, required:true}
    }
);

var Specie = mongoose.model("Specie", specieSchema);
module.exports = Specie;