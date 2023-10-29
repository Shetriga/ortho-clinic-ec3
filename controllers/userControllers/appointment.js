const { validationResult } = require("express-validator");
const Appointment = require("../../models/appointment");

exports.postNewAppointment = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }
  //   console.log(req.user);

  const { name, phone, date, time, clinic } = req.body;

  try {
    const newAppointment = new Appointment({
      userId: req.user.userId,
      name,
      phone,
      date,
      time,
      clinic,
    });

    await newAppointment.save();
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }

  res.sendStatus(201);
};

exports.getAppointments = async (req, res, next) => {
  let appointments;

  try {
    appointments = await Appointment.find({ userId: req.user.userId });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
  res.status(200).json({
    appointments,
  });
};
