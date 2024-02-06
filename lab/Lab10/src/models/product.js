const mongoose = require("mongoose");
const Category = require("./category");

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
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    validate: {
      validator: async function (value) {
        const isExist = await Category.exists({ _id: value });
        return isExist;
      },
      message: "Category does not exist",
    },
  },
});

let Product = mongoose.model("Product", productSchema);

module.exports = Product;
