/**
 * Created by tomas on 19.04.2017.
 */

var bcrypt = require("bcrypt");
var mongoose = require("mongoose");

var SALT_FACTOR = 10;

var userSchema = mongoose.Schema({
    username : {type: String, required: true, unique: true},
    password : {type: String, required: true},
    first_name : {type: String, required:true},
    last_name : {type: String, required:true}
});


userSchema.pre("save", function (done) {
   var user = this;
   if(!user.isModified("password")){
       return done();
   }

   bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
      if(err) {return done(err);}
      bcrypt.hash(user.password, salt, function (err, hashedPassword) {
          if(err) {return done(err);}
          user.password = hashedPassword;
          done();
      });
   });

});

userSchema.methods.checkPassword = function (plainPassword, done) {
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        done(err, isMatch);
    });
};

userSchema.methods.name = function(){
    return this.username;
};

var User = mongoose.model("User", userSchema);
module.exports = User;