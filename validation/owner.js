const { check } = require("express-validator");

exports.patientDataByIdValidations = [check("id", "ID is missing").notEmpty()];
