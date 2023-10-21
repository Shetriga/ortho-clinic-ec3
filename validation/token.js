const { check } = require("express-validator");

exports.tokenValidation = [check("token", "Token is missing").notEmpty()];
