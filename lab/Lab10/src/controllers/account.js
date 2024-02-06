const { promisify } = require("util");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Account = require("../models/account");

const secret = process.env.JWT_SECRET;
const expires = process.env.JWT_EXPIRES;

exports.getLoginForm = (req, res, next) => {
  res.render("login", { layout: "common" });
};

exports.getRegisterForm = (req, res, next) => {
  res.render("register", { layout: "common" });
};

exports.register = async (req, res, next) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    req.body.password = passwordHash;
    await Account.create(req.body);
    res.redirect("/account/login");
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const account = await Account.findOne({ email });
    // check if account exists
    if (account) {
      const match = await bcrypt.compare(password, account.password);
      // check if password correct
      if (match) {
        try {
          // create token
          const token = await promisify(jwt.sign)(
            {
              accountId: account._id,
            },
            secret,
            {
              expiresIn: expires,
            }
          );
          return res.status(200).json({
            status: "success",
            message: "Login successfully",
            token,
          });
        } catch (err) {
          console.log(err);
        }
      } else {
        return res.status(401).json({
          status: "failed",
          message: "Password invalid",
        });
      }
    } else {
      return res.status(401).json({
        status: "failed",
        message: "Account not exists",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
