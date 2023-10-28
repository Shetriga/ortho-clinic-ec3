const { check } = require("express-validator");

exports.tokenValidation = [
  check("refreshToken", "Refresh Token is missing").notEmpty(),
];
