const { check } = require("express-validator");

exports.patientDataByIdValidations = [check("id", "ID is missing").notEmpty()];

exports.patientDataByPhoneValidations = [
  check("phone", "Phone number is missing").notEmpty(),
];

exports.patientDataByNameValidations = [
  check("name", "Name is missing").notEmpty(),
];
