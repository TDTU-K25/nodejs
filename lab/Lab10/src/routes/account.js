const express = require("express");

const {
  getLoginForm,
  getRegisterForm,
  register,
  login,
} = require("../controllers/account");

const router = express.Router();

router.route("/register").get(getRegisterForm).post(register);
router.route("/login").get(getLoginForm).post(login);

module.exports = router;
