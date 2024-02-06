const mysql = require("promise-mysql");

exports.connectDB = async () => {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "",
      database: "users",
    });
    console.log("Connect DB success");
    return conn;
  } catch (err) {
    console.log(err);
  }
};
