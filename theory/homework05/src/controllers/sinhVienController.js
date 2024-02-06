const SinhVien = require("../models/sinhVien");
const sendErrorResponse = require("../utils/sendErrorResponse");

exports.getStudents = async (req, res) => {
  try {
    let students = await SinhVien.find({}).then((documents) => {
      return documents.map((document) => {
        return {
          ...document._doc,
          age: document.getAge(),
        };
      });
    });
    return students;
  } catch (err) {
    sendErrorResponse(res, err);
  }
};

exports.addStudent = async (req, res) => {
  try {
    await SinhVien.create(req.body);
  } catch (err) {
    sendErrorResponse(res, err);
  }
};
