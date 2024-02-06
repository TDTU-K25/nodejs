const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const AccountRouter = require("./routes/account");
const ProductRouter = require("./routes/product");
const OrderRouter = require("./routes/order");

const app = express();

app.use(cors());

app.use(express.static(`${__dirname}/public`));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/account", AccountRouter);
app.use("/api/products", ProductRouter);
app.use("/api/orders", OrderRouter);

module.exports = app;
