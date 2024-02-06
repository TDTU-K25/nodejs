const express = require("express");

const {
  renderPage,
  createNewFolder,
  addNewFile,
  search,
  renameFileOrFolder,
  deleteFileOrFolder,
  uploadFile,
  downloadFile
} = require("../controllers/file");

const router = express.Router();

// use() to catch all the url
router.route("/").get(renderPage).post(addNewFile);
router.post("/search", search);
router.post("/create-new-folder", createNewFolder);
router.put("/rename", renameFileOrFolder);
router.delete("/delete", deleteFileOrFolder);
router.post("/upload", uploadFile);
router.get("/download", downloadFile);

module.exports = router;
