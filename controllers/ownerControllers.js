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
