const Order = require("../models/order");

const sendErrorResponse = require("../utils/sendErrorResponse");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};

exports.addOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.status(200).json({
      status: "success",
      message: "Add order successfully",
      data: order,
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};

exports.getOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const orderFound = await Order.findById(id);
    res.status(200).json({
      status: "success",
      data: orderFound,
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};

exports.updateOrder = async (req, res) => {
  const id = req.params.id;
  try {
    const orderAfterUpdate = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: "success",
      message: "Update order successfully",
      data: orderAfterUpdate,
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};

exports.deleteOrder = async (req, res) => {
  const id = req.params.id;
  try {
    await Order.deleteOne({ _id: id });
    res.status(200).json({
      status: "success",
      message: "Delete order successfully",
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};
