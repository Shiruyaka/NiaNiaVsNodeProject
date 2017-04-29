var mongoose = require("mongoose");

var scheduleSchema = mongoose.Schema(
    {
        id_pokemon: {type:String, required:true},
        start_date: {type:Date, required:true},
        end_date: {type:Date, required:true},
        id_trening: {type:String, required:true}
    }
);

var Schedule = mongoose.model("Schedule", scheduleSchema);
module.exports = Schedule;