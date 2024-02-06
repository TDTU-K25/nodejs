const mongoose = require("mongoose");

const Product = require("./product");

const orderDetailSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Product",
      validate: {
        validator: async function (value) {
          const isExist = await Product.exists({ _id: value });
          return isExist;
        },
        message: "Product does not exist",
      },
    },
    quantity: Number,
    price: Number,
  },
  { _id: false }
);

let orderSchema = mongoose.Schema({
  totalPrice: {
    type: Number,
  },
  products: {
    type: [orderDetailSchema],
  },
});

let Order = mongoose.model("Order", orderSchema);

module.exports = Order;
