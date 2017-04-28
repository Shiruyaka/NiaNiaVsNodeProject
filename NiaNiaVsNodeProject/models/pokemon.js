var mongoose = require("mongoose");

var pokemonSchema = mongoose.Schema(
    {
        id_user: {type:String, required:true},
        name: {type:String},
        spiece: {type:String, required:true}
    }
);

var Pokemon = mongoose.model("Pokemon", pokemonSchema);
module.exports = Pokemon;