const fs = require("fs");

const express = require("express");
const hbs = require("express-handlebars");
const multiparty = require("multiparty");

const app = express();

app.engine(
  "handlebars",
  hbs.engine({
    defaultLayout: "main",
    helpers: {
      ifeq: function (a, b, options) {
        if (a == b) {
          return options.fn(this);
        }
        return options.inverse(this);
      },
    },
  })
);
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use("/modules", express.static("node_modules"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const calculate = (body) => {
  let { a, b, op } = body;
  a = a * 1; // convert string to number
  b = b * 1;
  let result = "";
  switch (op) {
    case "+":
      result = a + b;
      break;
    case "-":
      result = a - b;
      break;
    case "x":
      result = a * b;
      break;
    case "/":
      result = a / b;
      break;
    default:
      break;
  }
  return {
    a,
    b,
    op,
    result,
  };
};

app.get("/tinhtoan1", (req, res) => {
  res.render("tinhtoan1");
});

app.post("/tinhtoan1", (req, res) => {
  const { result, a, b, op } = calculate(req.body);
  res.render("tinhtoan1", { result, a, b, op });
});

app.get("/tinhtoan2", (req, res) => {
  res.render("tinhtoan2");
});

app.post("/tinhtoan2", (req, res) => {
  const { result } = calculate(req.body);
  res.json({
    result,
  });
});

app.get("/", (req, res) => {
  fs.readdir(`${__dirname}/public/uploads`, (err, files) => {
    files = files.map((fileName) => `/uploads/${fileName}`);
    res.render("home", { images: files });
  });
});

app.get("/upload", (req, res) => {
  res.render("upload");
});

app.post("/upload-images", (req, res) => {
  const form = new multiparty.Form();
  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({
      message: err.message,
      filename: files.images[0].originalFilename,
      status: 500
    });
    files.images.forEach((image) => {
      fs.copyFile(
        image.path,
        `${__dirname}/public/uploads/${image.originalFilename}`,
        (err) => {
          fs.unlink(image.path, (err) => {
            console.log(`Delete file ${image.path} successfully`);
          });
        }
      );
    });
    res.json({
      status: 200,
      filename: files.images[0].originalFilename,
    });
  });
});

const port = 8000;
app.listen(port, (err) => {
  console.log(`Server starts at ${port}`);
});
