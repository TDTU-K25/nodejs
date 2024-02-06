const mongoose = require("mongoose");

let productSchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, "A product must have name"],
  },
  price: {
    type: Number,
    require: [true, "A product must have price"],
  },
  image: {
    type: String,
    require: [true, "A product must have image"],
  },
  description: {
    type: String,
  },
});

let Product = mongoose.model("Product", productSchema);

module.exports = Product;
