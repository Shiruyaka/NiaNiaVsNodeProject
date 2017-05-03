var mongoose = require("mongoose");

var pokemonSchema = mongoose.Schema(
    {
        id_user: {type:String, required:true},
        name: {type:String},
        specie: {type:String, required:true},
        on_training: {type: Boolean, required:true}
    }
);

var Pokemon = mongoose.model("Pokemon", pokemonSchema);
module.exports = Pokemon;