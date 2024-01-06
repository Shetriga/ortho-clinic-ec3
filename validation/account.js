const { check } = require("express-validator");

exports.resetPasswordValidations = [
  check("phone", "Phone number is missing").notEmpty(),
  check("email", "Email is missing").notEmpty(),
];

exports.newPasswordValidations = [
  check("password", "Password is missing").notEmpty(),
  check("confirmPassword", "Confirm Password is missing").notEmpty(),
  check("phone", "Phone is missing").notEmpty(),
];

exports.resetCodeValidations = [
  check("phone", "Phone is missing").notEmpty(),
  check("code", "Code is missing").notEmpty(),
];

exports.deleteAccountValidations = [
  check("phone", "Phone number is missing").notEmpty(),
  check("password", "Password is missing").notEmpty(),
];
