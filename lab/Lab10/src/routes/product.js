const express = require("express");

const { getProductDetail } = require("../controllers/product");

const router = express.Router();

router.route("/:productId").get(getProductDetail);

module.exports = router;
