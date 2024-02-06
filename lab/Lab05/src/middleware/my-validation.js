const { body, validationResult } = require("express-validator");

// sequential processing, stops running validations chain if the previous one fails.
const validate = async (req, res, next, validations) => {
  for (let validation of validations) {
    const result = await validation.run(req);
    if (result.errors.length) break;
  }

  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  req.session.flash = {
    type: "danger",
    message: errors.array()[0].msg,
  };
  next();
};

const validateFormOfUser = (req, res, next) => {
  validate(req, res, next, [
    body("name").notEmpty().withMessage("Name can not be empty"),
    body("email")
      .notEmpty()
      .withMessage("Email can not be empty")
      .isEmail()
      .withMessage("Not a valid e-mail address"),
    body("gender")
      .notEmpty()
      .withMessage("Gender can not be empty")
      .isIn(["male", "female"])
      .withMessage("Gender must be male or female"),
    body("status")
      .notEmpty()
      .withMessage("Status can not be empty")
      .isIn(["active", "inactive"])
      .withMessage("Status must be active or inactive"),
  ]);
};

module.exports = { validateFormOfUser };
