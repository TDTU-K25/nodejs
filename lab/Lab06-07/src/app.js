const express = require("express");
const hbs = require("express-handlebars");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const AccountRouter = require("./routes/account");
const FileRouter = require("./routes/file");

const app = express();

app.engine(
  "handlebars",
  hbs.engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

app.use(cookieParser());
app.use("/account", csrf({ cookie: true })); // apply csrf for account route
app.use("/account", (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(
  require("express-session")({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
  })
);

// session flash
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

// if already login
app.use(/^\/(login|register)$/, (req, res, next) => {
  if (req.session.email) {
    return res.redirect("/");
  }
  next();
});

app.use("/account", AccountRouter);

// if not login yet
app.use((req, res, next) => {
  if (!req.session.email) {
    return res.redirect("/account/login");
  }
  next();
});
app.use("/home", FileRouter);

app.get("/error", (req, res) => {
  res.render("404");
});

app.use((req, res, next) => {
  res.redirect("/error");
});

app.use((err, req, res, next) => {
  console.log(err);
  next();
});

const port = 8000;
app.listen(port, () => {
  console.log(`Server starts at ${port}`);
});
