const express = require("express");

const {
  createOrder
} = require("../controllers/order");

const router = express.Router();

router.route("/").post(createOrder);

module.exports = router;
  