const express = require("express");
const mongoose = require("mongoose");
const formidable = require("formidable");
const hbs = require("express-handlebars");
const fs = require("fs");
const fsExtra = require("fs-extra");
const { promisify } = require("util");

const User = require("./models/user");
const Album = require("./models/album");
const Photo = require("./models/photo");

const AlbumRouter = require("./routes/album");

const { connectionString } = require("./credentials");

const app = express();

app.engine(
  "handlebars",
  hbs.engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded());

const publicDir = __dirname + "/public";

app.use(express.static(publicDir));
app.use("/modules", express.static(`node_modules`));
app.use(
  require("express-session")({
    secret: "nb2};AyqS>uw`Qu",
    resave: false,
    saveUninitialized: false,
  })
);

mongoose
  .connect(connectionString.development)
  .then(console.log("Connect DB successfully"))
  .catch((err) => console.log(err));

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/login", async (req, res, next) => {
  const { username, password } = req.body;
  const userFound = await User.findOne({ username, password });
  req.session.userId = userFound._id;
  res.redirect("/albums");
});

app.use((req, res, next) => {
  if (req.session.userId) {
    return next();
  }
  res.redirect("/login");
});

app.use("/albums", AlbumRouter);

const uploadsDir = publicDir + "/uploads";

app.post("/upload", (req, res) => {
  const userId = req.session.userId;
  const userDir = uploadsDir + `/${userId}`;
  if (fs.existsSync(userDir)) {
    const form = new formidable.IncomingForm();
    form.parse(req, async (err, fields, files) => {
      let album = await Album.findOne({ name: fields.albumName[0] });
      if (!album) {
        album = await Album.create({
          name: fields.albumName[0],
          owner: userId,
        });
      }

      const albumDir = userDir + `/${fields.albumName[0]}`;
      if (fs.existsSync(albumDir)) {
        files.photos.forEach(async (photo) => {
          await promisify(fsExtra.copy)(
            photo.filepath,
            `${albumDir}/${photo.newFilename}.jpg`
          );
          await promisify(fs.unlink)(photo.filepath);
          await Photo.create({
            filename: `${userId}/${fields.albumName[0]}/${photo.newFilename}.jpg`,
            album: album._id,
          });
        });
        res.json({
          status: "success",
        });
      } else {
        fs.mkdir(albumDir, (err) => {});
      }
    });
  } else {
    fs.mkdir(userDir, (err) => {});
  }
});

const port = 8000;
app.listen(port, (err) => {
  console.log(`Server starts at port ${port}`);
});
