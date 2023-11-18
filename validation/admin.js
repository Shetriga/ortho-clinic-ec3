const { check } = require("express-validator");

exports.appointmentCheckValidations = [
  check("date", "Date is missing").notEmpty(),
  check("time", "Time is missing").notEmpty(),
  check("clinic", "Clinic is missing").notEmpty(),
];
