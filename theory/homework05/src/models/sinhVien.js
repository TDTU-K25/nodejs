const mongoose = require("mongoose");

let sinhVienSchema = mongoose.Schema({
  name: String,
  gpa: Number,
  dob: Date,
  gender: Boolean,
  address: String,
  email: String,
});

sinhVienSchema.methods.getAge = function () {
  return new Date().getFullYear() - this.dob.getFullYear();
};

let SinhVien = mongoose.model("SinhVien", sinhVienSchema);

module.exports = SinhVien;
