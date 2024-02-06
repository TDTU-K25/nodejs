const express = require("express");

const {
  getLoginForm,
  getRegisterForm,
  login,
  register,
} = require("../controllers/account");

const router = express.Router();

router.route("/login").get(getLoginForm).post(login);
router.route("/register").get(getRegisterForm).post(register);

module.exports = router;
