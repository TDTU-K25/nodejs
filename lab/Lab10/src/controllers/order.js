const Order = require("../models/order");

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(200).json({
      status: "success",
      message: "Create order successfully",
      data: order,
    });
  } catch (err) {
    console.log(err);
  }
};