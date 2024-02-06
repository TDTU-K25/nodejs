const Product = require("../models/product");

const sendErrorResponse = require("../utils/sendErrorResponse");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      status: "success",
      data: products,
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};

exports.addProduct = async (req, res) => {
  req.body.image = `uploads/${req.file.filename}`; // multer
  try {
    const product = await Product.create(req.body);
    res.status(200).json({
      status: "success",
      message: "Add product successfully",
      data: product,
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};

exports.getProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const productFound = await Product.findById(id);
    res.status(200).json({
      status: "success",
      data: productFound,
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  if (req.file) {
    // if upload new image
    req.body.image = `uploads/${req.file.filename}`;
  }
  try {
    const productAfterUpdate = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: "success",
      message: "Update product successfully",
      data: productAfterUpdate,
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};

exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    await Product.deleteOne({ _id: id });
    res.status(200).json({
      status: "success",
      message: "Delete product successfully",
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};
