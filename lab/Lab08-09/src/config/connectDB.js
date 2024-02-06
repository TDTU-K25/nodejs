const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/lab08_09")
  .then(() => {
    console.log("Connect db success");
  })
  .catch((err) => {
    console.log(err);
  });
