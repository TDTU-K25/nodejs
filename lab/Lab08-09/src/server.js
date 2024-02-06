const app = require("./app");

require("./config/connectDB");

const port = 8000;
app.listen(port, (err) => {
  console.log(`Server starts at port ${port}`);
});
