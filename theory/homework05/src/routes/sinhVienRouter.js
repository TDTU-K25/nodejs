const express = require("express");
const {
  getStudents,
  addStudent,
} = require("../controllers/sinhVienController");

const router = express.Router();

router.get("/list", async (req, res) => {
  const students = await getStudents(req, res);
  res.render("home", { students });
});

router
  .route("/add")
  .get((req, res) => {
    res.render("add");
  })
  .post(async (req, res) => {
    await addStudent(req, res);
    req.session.flash = {
      type: "success",
      message: "Thêm sinh viên thành công",
    };
    res.status(301).redirect("/list");
  });

module.exports = router;
