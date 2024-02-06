const express = require("express");
const hbs = require("express-handlebars");
const sinhVienRouter = require("./routes/sinhVienRouter");

const app = express();

app.engine(
  "handlebars",
  hbs.engine({
    defaultLayout: "main",
    helpers: {
      getGender: function (booleanVal) {
        return booleanVal ? "Male" : "Female";
      },
    },
  })
);

app.set("view engine", "handlebars");

app.use(express.urlencoded());
app.use(express.json());

app.use(
  require("express-session")({
    secret: "BGjfk8lAHYecqOKyDPMsoxc0P437BGGK",
  })
);

// flash message
app.use((req, res, next) => {
  res.locals.flash = req.session.flash;
  delete req.session.flash;
  next();
});

app.use("/", sinhVienRouter);

module.exports = app;
