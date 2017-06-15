const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');


//the tutorial has facebook and twitter as well but
//I think this is fine for now just having local
const userSchema = mongoose.Schema({
  local         : {
    username    : String,
    password    : String,
  }
});

// this is literally insane
userSchema.methods.generateHash = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check is password is valid
userSchema.methods.validPassword = (password) => {
  return bcrypt.compareSync(password, this.local.password);
}

userSchema.statics.validPassword = (password, user) => {
  return bcrypt.compareSync(password, user.local.password);
}

module.exports = mongoose.model('User', userSchema);
