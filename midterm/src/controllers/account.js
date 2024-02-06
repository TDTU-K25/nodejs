const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const Account = require("../models/account");
const jwt = require("jsonwebtoken");
const e = require("express");

const secret = process.env.JWT_SECRET;
const expires = process.env.JWT_EXPIRES;

exports.register = async (req, res, next) => {
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    req.body.password = passwordHash;
    console.log(req.body);
    await Account.create(req.body);
    res.status(200).json({
      status: "success",
      message: "Register account successfully",
    });
  } catch (err) {
    console.log(err)
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
          console.log(err)
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
    console.log(err)
  }
};

exports.getAllUser = async (req, res, next) => {
  try {
    const payLoad = jwt.verify(req.body.token, process.env.JWT_SECRET);
    const userID = payLoad.accountId;
    const account = await Account.find({_id: { $nin: userID}} );
    res.status(200).json({
      status: "success",
      data: account,
    });
  } catch (err) {
    console.log(err)
  }
};
