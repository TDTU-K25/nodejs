const Product = require("../models/product");

exports.getProductDetail = async (req, res) => {
    const {productId} = req.params;
    try {
      const productFound = await Product.findById(productId);
      res.status(200).json({
        status: "success",
        data: productFound,
      });
    } catch (err) {
      console.log(Error)
    }
  };
  