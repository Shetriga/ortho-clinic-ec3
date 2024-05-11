const User = require("../models/User");
const Appointment = require("../models/appointment");
const { validationResult } = require("express-validator");
const { sendNotification } = require("../util/notification");

exports.postPatientDataById = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { id } = req.body;
  try {
    const foundPatient = await User.findOne({ patientId: id });
    if (!foundPatient) return res.sendStatus(404);

    res.status(200).json({
      name: foundPatient.username,
      gender: foundPatient.gender,
      id: foundPatient._id,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.postPatientDataByPhone = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { phone } = req.body;
  try {
    const foundPatient = await User.findOne({ phone: phone });
    if (!foundPatient) return res.sendStatus(404);

    res.status(200).json({
      name: foundPatient.username,
      gender: foundPatient.gender,
      id: foundPatient._id,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.postPatientDataByName = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { name } = req.body;
  try {
    const foundPatient = await User.findOne({ username: name });
    if (!foundPatient) return res.sendStatus(404);

    res.status(200).json({
      name: foundPatient.username,
      gender: foundPatient.gender,
      id: foundPatient._id,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.postPatientDataByIdAndPhone = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { id, phone } = req.body;
  try {
    const foundPatient = await User.findOne({ patientId: id, phone: phone });
    if (!foundPatient) return res.sendStatus(404);

    res.status(200).json({
      name: foundPatient.username,
      gender: foundPatient.gender,
      id: foundPatient._id,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.getUserDataByOwner = async (req, res, next) => {
  const userId = req.params.uid;
  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) return res.sendStatus(404);

    res.status(200).json({
      user: foundUser,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.getUserAppointmentsByOwner = async (req, res, next) => {
  const userId = req.params.uid;

  let appointments;

  try {
    appointments = await Appointment.find({ userId });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
  res.status(200).json({
    appointments,
  });
};

exports.cancelDay = async (req, res, next) => {
  const day = req.params.day;

  try {
    const dayAppointments = await Appointment.find({ date: day }).populate(
      "userId"
    );
    if (!dayAppointments) return res.sendStatus(404);

    if (dayAppointments.length === 0) return res.sendStatus(404);

    // Now we know there are appointments in that specific day
    console.log(dayAppointments);
    dayAppointments.forEach(async (ap) => {
      await sendNotification({
        registrationToken: ap.userId.notificationToken,
        body: "Appointment Cancelled",
        title: "Sorry!",
      });
    });

    res.status(200).json({
      appointments: dayAppointments,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};
