const Appointment = require("../models/appointment");
const User = require("../models/User");
const Visit = require("../models/visit");
const orthoBucket = require("../middleware/google_cloud_storage");
const Image = require("../models/image");
const { deleteFile } = require("../util/delete_file");

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
    await newImage.save();
    // Delete the file from the server after uploading
    deleteFile(`images/${image.filename}`);
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }

  res.sendStatus(201);
};

exports.postAddVisit = async (req, res, next) => {
  const appointmentId = req.params.aid;
  const userId = req.params.uid;

  try {
    const foundAppointment = await Appointment.findById(appointmentId);
    const foundUser = await User.findById(userId);
    if (!foundAppointment || !foundUser) return res.sendStatus(404);

    const newVisit = new Visit({
      appointmentId,
      userId,
    });
    await newVisit.save();
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }

  res.sendStatus(201);
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
