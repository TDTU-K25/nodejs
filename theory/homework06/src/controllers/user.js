const User = require("../models/user");

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  const userFound = await User.findOne({ username, password });
  if (userFound) {
    req.session.userId = userFound._id;
    res.send("login success");
  }
  res.send("login failed");
};
