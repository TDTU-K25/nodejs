const express = require("express");
const {
  renderDetailAlbumPage,
  getAllAlbums,
  getCreateAlbumForm,
  getAlbum,
} = require("../controllers/album");

const router = express.Router();

router.get("/", getAllAlbums);
router.route("/create").get(getCreateAlbumForm);
router.get("/detail/:id", renderDetailAlbumPage);
router.get("/:id", getAlbum);

module.exports = router;
