const bcrypt = require("bcrypt");
const { connectDB } = require("../utils/db");

exports.getLoginForm = (req, res) => {
  res.render("login");
};

exports.getRegisterForm = (req, res) => {
  res.render("register");
};

exports.login = async (req, res) => {
  let conn = await connectDB();
  const { email, password } = req.body;
  let hashPassword;
  try {
    const result = await conn.query(
      "SELECT * FROM accounts WHERE email = ? LIMIT 1",
      [email]
    );
    if (result.length === 0) {
      throw new Error("Email not found");
    } else {
      hashPassword = result[0].password;
    }
  } catch (err) {
    req.session.flash = {
      type: "danger",
      message: err.message,
    };
    return res.redirect(`${req.baseUrl}/login`);
  }
  let result = await bcrypt.compare(password, hashPassword);
  if (result) {
    req.session.email = email;
    res.redirect("/home/");
  } else {
    req.session.flash = {
      type: "danger",
      message: "Email or password not match",
    };
    res.redirect(`${req.baseUrl}/login`);
  }
};

exports.register = async (req, res) => {
  let conn = await connectDB();
  const { fullName, email, password, passwordConfirm } = req.body;
  if (password !== passwordConfirm) {
    req.session.flash = {
      type: "danger",
      message: "Password not match",
    };
    return res.redirect(`${req.baseUrl}/register`);
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const sql = `INSERT INTO accounts (fullName, email, password) VALUES ('${fullName}','${email}', '${hashPassword}')`;
  conn.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect(`${req.baseUrl}/login`);
  });
};
