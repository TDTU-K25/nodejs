const mongoose = require("mongoose");

let userSchema = mongoose.Schema({
  username: mongoose.SchemaTypes.String,
  password: mongoose.SchemaTypes.String,
});

const User = mongoose.model("User", userSchema);

module.exports = User;
