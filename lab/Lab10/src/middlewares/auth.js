const { promisify } = require("util");

const jwt = require("jsonwebtoken");

const Account = require("../models/account");
const sendErrorResponse = require("../utils/sendErrorResponse");

const secret = process.env.JWT_SECRET;

exports.checkLogin = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // remove Bearer
    }

    if (!token) {
      return res.status(401).json({
        status: "failed",
        message: "Please login before doing this action",
      });
    }

    const payload = await promisify(jwt.verify)(token, secret);
    if (payload.exp < Date.now() / 1000) {
      return res.status(401).json({
        status: "failed",
        message: "Token expired",
      });
    }

    const accountFound = await Account.findById(payload.accountId);
    if (accountFound) {
      next();
    } else {
      return res.status(401).json({
        status: "failed",
        message: "Account not found",
      });
    }
  } catch (err) {
    sendErrorResponse(res, 500, err);
  }
};
