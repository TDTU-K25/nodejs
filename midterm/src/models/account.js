const mongoose = require("mongoose");

let accountSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "An account must have name"],
  },
  email: {
    type: String,
    require: [true, "An account must have email"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "An account must have password"],
  },
  avatar: {
    type: String,
    default: "./images/avatar/avatar.png",
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
});

let Account = mongoose.model("Account", accountSchema);

module.exports = Account;
