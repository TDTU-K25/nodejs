const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://admin:zmkusY7gaheraetZ@cluster0.vh9sbtu.mongodb.net/?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connect db success");
  })
  .catch((err) => {
    console.log(err);
  });
