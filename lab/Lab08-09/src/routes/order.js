const express = require("express");

const {
  getOrders,
  addOrder,
  getOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/order");

const { checkLogin } = require("../middlewares/auth");

const router = express.Router();

router.route("/").get(checkLogin, getOrders).post(checkLogin, addOrder);
router
  .route("/:id")
  .get(checkLogin, getOrder)
  .put(checkLogin, updateOrder)
  .delete(checkLogin, deleteOrder);

module.exports = router;
