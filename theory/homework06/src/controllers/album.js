const Album = require("../models/album");
const Photo = require("../models/photo");

exports.renderDetailAlbumPage = (req, res, next) => {
  res.render("detail");
};

exports.getAllAlbums = async (req, res, next) => {
  const albums = await Album.find().lean();
  res.render("index", { albums });
};

exports.getCreateAlbumForm = (req, res, next) => {
  res.render("createAlbum");
};

exports.getAlbum = async (req, res, next) => {
  const id = req.params.id;
  const photos = await Photo.find({ album: id }).lean().populate("album");
  res.status(200).json({
    status: "success",
    photos,
  });
};
