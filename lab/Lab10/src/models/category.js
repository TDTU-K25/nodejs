const mongoose = require("mongoose");

let categorySchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "A category must have name"],
  },
});

let Category = mongoose.model("Category", categorySchema);

module.exports = Category;
