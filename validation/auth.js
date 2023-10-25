const { check } = require("express-validator");

exports.postLoginValidation = [
  check("username", "Username is missing").notEmpty(),
  check("password", "Password is missing").notEmpty(),
];

exports.postSignUpValidation = [
  check("username", "Username is missing").notEmpty(),
  check("password", "Password is missing").notEmpty(),
  check("gender", "Gender is missing").notEmpty(),
  check("phone", "Phone is missing").notEmpty(),
];

exports.logoutValidation = [
  check("refreshToken", "Refresh Token is missing").notEmpty(),
];
