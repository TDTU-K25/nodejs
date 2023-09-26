const express = require("express");
const hbs = require("express-handlebars");

const app = express();

app.engine(
  "handlebars",
  hbs.engine({
    defaultLayout: "main",
    helpers: {
      currency: (money) => {
        return money + "$";
      },
      // function helper
      table: (rows, cols) => {
        let table = `<table class="table table-striped">`;
        for (let i = 1; i <= rows; i++) {
          table += "<tr>";
          for (let j = 1; j <= cols; j++) {
            table += `<td>${i},${j}</td>`;
          }
          table += "</tr>";
        }
        table += "</table>";
        return table;
      },
      // block helper
      for: function (start, end, options) {
        let html = "";
        for (let i = start; i <= end; i++) {
          html += options.fn({ value: i }); // should pass the object to options.fn instead of single value
        }
        return html;
      },
    },
  })
);

app.set("view engine", "handlebars");

const product = {
  name: "Nike Air Force",
  price: 120,
  desc: `The radiance lives on in the Nike Air Force, the basketball original that puts a fresh spin on what you know best: durably stitched overlays, clean finishes and the perfect amount of flash to make you shine.`,
  images: [
    "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png",
    "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/82aa97ed-98bf-4b6f-9d0b-31a9f907077b/air-force-1-07-shoes-WrLlWX.png",
    "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/3cc96f43-47b6-43cb-951d-d8f73bb2f912/air-force-1-07-shoes-WrLlWX.png",
  ],
  vars: [
    {
      name: "Nike Air Force Black",
      price: 130,
    },
    {
      name: "Nike Air Force Custom",
      price: 145,
    },
  ],
};

app.get("/details", (req, res) => {
  res.render("details", {
    product,
  });
});

app.get("/table", (req, res) => {
  res.render("table");
});

const port = 8000;
app.listen(port, (err) => {
  console.log(`Server starts at port ${port}`);
});
