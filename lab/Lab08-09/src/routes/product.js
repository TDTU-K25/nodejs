const express = require("express");
const multer = require("multer");
const mime = require("mime-types");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/image/products`);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}.${mime.extension(file.mimetype)}`);
  },
});

const upload = multer({ storage });

const {
  getProducts,
  addProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

const { checkLogin } = require("../middlewares/auth");

const router = express.Router();

router
  .route("/")
  .get(getProducts)
  .post(checkLogin, upload.single("image"), addProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(checkLogin, upload.single("image"), updateProduct)
  .delete(checkLogin, deleteProduct);

module.exports = router;
