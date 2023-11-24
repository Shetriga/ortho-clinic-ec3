const Appointment = require("../models/appointment");
const User = require("../models/User");
const Visit = require("../models/visit");
const orthoBucket = require("../middleware/google_cloud_storage");
const Image = require("../models/image");
const { deleteFile } = require("../util/delete_file");
const { sendNotification } = require("../util/notification");

const { validationResult } = require("express-validator");

exports.postVisitImage = async (req, res, next) => {
  const image = req.file;
  const visitId = req.params.vid;

  try {
    const foundVisit = await Visit.findById(visitId);
    if (!foundVisit) return res.sendStatus(404);
    const userId = foundVisit.userId.toString();
    orthoBucket.upload(
      `./images/${image.filename}`,
      {
        destination: `${visitId}/${image.filename}`,
      },
      (err, file) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Saved to google cloud storage");
        }
      }
    );
    const newImage = new Image({
      visitId,
      userId,
      imageUrl: `${process.env.GOOGLE_CLOUD_STORAGE}${visitId}/${image.filename}`,
    });
    const createdImage = await newImage.save();

    // Insert the image url in the visit document in visit table so the array will not be empty for the user
    // when he/she shows the images of an appointment
    foundVisit.imageUrls.push(createdImage.imageUrl);
    await foundVisit.save();

    // Send notification to user rgat image is available
    const foundUser = await User.findById(userId);
    const notificationsToken = foundUser.notificationToken;
    if (notificationsToken !== null && notificationsToken !== "") {
      await sendNotification({
        registrationToken: notificationsToken,
        title: "تم إضافة صورة",
        body: "الصورة موجودة الآت",
      });
    }

    // Delete the file from the server after uploading
    deleteFile(`images/${image.filename}`);
    return res.status(201).json({
      imageUrl: createdImage.imageUrl,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.postAddVisit = async (req, res, next) => {
  const appointmentId = req.params.aid;
  const userId = req.params.uid;

  try {
    const foundAppointment = await Appointment.findById(appointmentId);
    const foundUser = await User.findById(userId);
    if (!foundAppointment || !foundUser) return res.sendStatus(404);

    // Check if a visit already exists for that specific appointment
    const visitAlreadyExists = await Visit.findOne({ appointmentId });
    if (visitAlreadyExists) return res.sendStatus(409); // Conflict

    const newVisit = new Visit({
      appointmentId,
      userId,
    });
    const createdVisit = await newVisit.save();

    res.status(201).json({
      visitId: createdVisit._id,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.getAllAppointments = async (req, res, next) => {
  try {
    const foundAppointments = await Appointment.find({});
    res.status(200).json({
      appointments: foundAppointments,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.getAppointmentDetails = async (req, res, next) => {
  const appointmentId = req.params.aid;
  try {
    const foundAppointment = await Appointment.findById(appointmentId);
    if (!foundAppointment) return res.sendStatus(404);

    res.status(200).json({
      appointment: foundAppointment,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.patchAppointmentWaiting = async (req, res, next) => {
  const appointmentId = req.params.aid;
  try {
    const foundAppointment = await Appointment.findById(appointmentId);
    if (!foundAppointment) return res.sendStatus(404);

    foundAppointment.status = "Waiting";
    await foundAppointment.save();

    res.sendStatus(200);
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.patchAppointmentDone = async (req, res, next) => {
  const appointmentId = req.params.aid;
  try {
    const foundAppointment = await Appointment.findById(appointmentId);
    if (!foundAppointment) return res.sendStatus(404);

    foundAppointment.status = "Done";
    await foundAppointment.save();

    res.sendStatus(200);
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.getVisitId = async (req, res, next) => {
  const appointmentId = req.params.aid;

  try {
    const foundVisit = await Visit.findOne({ appointmentId });
    if (!foundVisit) return res.sendStatus(404);

    return res.status(200).json({
      visitId: foundVisit._id,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.deleteAppointment = async (req, res, next) => {
  const appointmentId = req.params.aid;
  try {
    const foundAppointment = Appointment.findById(appointmentId);
    if (!foundAppointment) return res.sendStatus(404);
    const foundVisit = Visit.findOne({ appointmentId });
    if (foundVisit) {
      await foundVisit.deleteOne();
    }
    await foundAppointment.deleteOne();
    res.sendStatus(200);
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.getAppointmentsForClinic = async (req, res, next) => {
  const clinic = req.params.clinic;

  try {
    const appointments = await Appointment.find({ clinic });
    res.status(200).json({
      appointments,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.postAppointmentAlreadyExists = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { date, time, clinic } = req.body;

  try {
    const foundAppointment = await Appointment.findOne({ date, time, clinic });
    if (!foundAppointment) return res.sendStatus(404);
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }

  res.sendStatus(200);
};
