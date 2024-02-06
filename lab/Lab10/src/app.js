const path = require("path");

const express = require("express");
const hbs = require("express-handlebars");
const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

const AccountRouter = require("./routes/account");
const ProductRouter = require("./routes/product");
const OrderRouter = require("./routes/order");
const Product = require("./models/product");
const Category = require("./models/category");

const app = express();

app.engine(
  "handlebars",
  hbs.engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");
app.set("partials", path.join(__dirname, "/views/partials"));

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", async (req, res) => {
  const products = await Product.find({}).lean();
  const categories = await Category.find({}).lean();
  res.render("index", {
    products,
    categories,
  });
});

app.get("/shop", async (req, res) => {
  const { category: keyword } = req.query;
  const category = await Category.findOne({ name: keyword });
  const products = await Product.find({ category: category._id }).lean();
  const categories = await Category.find({}).lean();
  res.render("shop", { products, categories });
});

app.get("/cart", (req, res) => {
  res.render("cart", { layout: "common" });
});

app.use("/account", AccountRouter);
app.use("/products", ProductRouter);
app.use("/orders", OrderRouter);

module.exports = app;
