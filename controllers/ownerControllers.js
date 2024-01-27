const User = require("../models/User");
const { validationResult } = require("express-validator");

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
