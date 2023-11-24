const { check } = require("express-validator");

exports.appointmentCheckValidations = [
  check("date", "Date is missing").notEmpty(),
  check("time", "Time is missing").notEmpty(),
  check("clinic", "Clinic is missing").notEmpty(),
];

exports.putAppointmentValidations = [
  check("name", "Name is missing").notEmpty(),
  check("date", "Date is missing").notEmpty(),
  check("time", "Time is missing").notEmpty(),
  check("phone", "Phone is missing").notEmpty(),
];
