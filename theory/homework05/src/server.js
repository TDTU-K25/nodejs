const mongoose = require("mongoose");

const app = require("./app");

const { connectionString } = require("./credentials");

mongoose.connect(connectionString.development);

const port = 8000;
app.listen(8000, (err) => {
  console.log(`Server starts at port ${port}`);
});
