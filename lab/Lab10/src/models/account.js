const mongoose = require("mongoose");

let accountSchema = mongoose.Schema({
  email: {
    type: String,
    require: [true, "An account must have email"],
    unique: true,
  },
  password: {
    type: String,
    require: [true, "An account must have password"],
  },
});

let Account = mongoose.model("Account", accountSchema);

module.exports = Account;
