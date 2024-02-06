const express = require("express");
const hbs = require("express-handlebars");
const { rateLimit } = require("express-rate-limit");
const methodOverride = require("method-override");
const cors = require("cors");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const myBodyParser = require("./middleware/my-body-parser");
const { validateFormOfUser } = require("./middleware/my-validation");

const accessToken =
  "Bearer 63d7077eb7710d1613fc41d0da63d40f14d02ce264c7008cbb7b2e232ec82bfc";

const app = express();

// Overriding the Content-Type request header is not allowed for no-cors requests
// => change to cors
app.use(cors());

// override with POST having ?_method
app.use(methodOverride("_method"));

// Handlebars
app.engine(
  "handlebars",
  hbs.engine({
    defaultLayout: "main",
    helpers: {
      ifEqual: function (firstVal, secondVal, options) {
        if (firstVal === secondVal) {
          return options.fn(this);
        }
      },
    },
  })
);
app.set("view engine", "handlebars");

// prevent DDOS attack by rate limit mechanism
app.use(
  rateLimit({
    windowMs: 2 * 60 * 1000, // 2 minutes
    max: 20, // Limit each IP to 20 requests per `window` (here, per 2 minutes)
    standardHeaders: "draft-7", // draft-6: RateLimit-* headers; draft-7: combined RateLimit header
    legacyHeaders: false, // X-RateLimit-* headers
    // store: ... , // Use an external store for more precise rate limiting
  })
);

// Handle req.body
app.use(myBodyParser);

// Session
app.use(
  require("express-session")({
    secret: "secret-lab05",
    resave: true,
    saveUninitialized: true,
  })
);

// flash message
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// Get all users
app.get("/users", async (req, res) => {
  const response = await fetch("https://gorest.co.in/public/v2/users");
  const users = await response.json();
  res.render("index", {
    users,
  });
});

// Add user
app.get("/users/add", (req, res) => {
  res.render("add");
});

app.post("/users/add", validateFormOfUser, async (req, res) => {
  // Form validation error
  if (req.session?.flash?.type === "danger") {
    return res.redirect("/users/add");
  }
  try {
    const response = await fetch("https://gorest.co.in/public/v2/users", {
      method: "POST",
      headers: {
        Authorization: accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    console.log(data);

    req.session.flash = {
      type: "success",
      message: `Thêm thành công`,
    };
    res.redirect("/users");
  } catch (err) {
    console.log(err);
  }
});

// Get detail
app.get("/users/:id", async (req, res) => {
  const id = req.params.id;
  const response = await fetch(`https://gorest.co.in/public/v2/users/${id}`);
  const user = await response.json();
  res.render("detail", { user });
});

// Update user
app.get("/users/:id/edit", async (req, res) => {
  const id = req.params.id;
  const response = await fetch(`https://gorest.co.in/public/v2/users/${id}`);
  const user = await response.json();
  res.render("edit", {
    user,
  });
});

app.put("/users/:id/edit", validateFormOfUser, async (req, res) => {
  const id = req.params.id;
  // Form validation error
  if (req.session?.flash?.type === "danger") {
    return res.redirect(`/users/${id}/edit`);
  }
  const response = await fetch(`https://gorest.co.in/public/v2/users/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: accessToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req.body),
  });
  const data = await response.json();
  console.log(data);
  req.session.flash = {
    type: "success",
    message: `Cập nhật thành công`,
  };
  res.redirect("/users");
});

// Delete user
app.delete("/users/delete", async (req, res) => {
  const id = req.body.id;
  const response = await fetch(`https://gorest.co.in/public/v2/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: accessToken,
    },
  });
  console.log(response);
  req.session.flash = {
    type: "success",
    message: `Xoá thành công`,
  };
  res.status(200).json({
    status: "success",
  });
});

app.get("/error", (req, res, next) => {
  res.render("404");
});

app.use((req, res, next) => {
  res.redirect("/error");
});

app.use((err, req, res, next) => {
  res.status(500).json({
    status: "fail",
    message: err.message,
  });
});

const port = 8000;
app.listen(port, (err) => {
  console.log(`Server starts at port ${port}`);
});
