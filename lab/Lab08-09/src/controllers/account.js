const { promisify } = require("util");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Account = require("../models/account");

const sendErrorResponse = require("../utils/sendErrorResponse");

const secret = process.env.JWT_SECRET;
const expires = process.env.JWT_EXPIRES;

exports.register = async (req, res, next) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    req.body.password = passwordHash;
    await Account.create(req.body);
    res.status(200).json({
      status: "success",
      message: "Register account successfully",
    });
  } catch (err) {
    sendErrorResponse(res, 500, err);
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
          sendErrorResponse(res, 500, err);
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
    sendErrorResponse(res, 500, err);
  }
};
