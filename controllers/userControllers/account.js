const User = require("../../models/User");
const Appointment = require("../../models/appointment");
const Image = require("../../models/image");
const AuthInfo = require("../../models/authInfo");
const Visit = require("../../models/visit");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const { sendNotification } = require("../../util/notification");

exports.patchNotificationToken = async (req, res, next) => {
  const token = req.params.token;

  try {
    const foundUser = await User.findById(req.user.userId);
    foundUser.notificationToken = token;
    await foundUser.save();
    res.status(200).json({
      notificationToken: foundUser.notificationToken,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.putAccountInfo = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { name, phone } = req.body;
  const userId = req.user.userId;
  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) return res.sendStatus(404);

    foundUser.username = name;
    foundUser.phone = phone;
    await foundUser.save();
    res.sendStatus(200);
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.postDeleteAccount = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { phone, password } = req.body;

  try {
    const foundUser = await User.findOne({ phone });
    if (!foundUser)
      return res
        .status(404)
        .json({ message: "Could not find user with provided phone number" });
    const hashedPassword = await bcrypt.hash(password, 12);
    if (hashedPassword !== foundUser.password)
      return res.status(402).json({ message: "Wrong password" });
    // Now delete the user
    await foundUser.deleteOne();
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }

  res.sendStatus(200);
};

exports.deleteAccount = async (req, res, next) => {
  const userId = req.user.userId;
  let notiToken;

  try {
    const foundUser = await User.findById(userId);
    if (!foundUser) return res.sendStatus(404);
    // Now we know the user exists
    if (foundUser.notificationToken !== null) {
      notiToken = foundUser.notificationToken;
    }
    // Delete all data related to that user id from database
    const userNotiToken = await User.findByIdAndDelete(userId); // User
    await AuthInfo.findOneAndDelete({ userId: userId }); // AuthInfo
    const userAppointments = await Appointment.find({ userId: userId }); // Appointments
    for (const ap of userAppointments) {
      await ap.deleteOne();
    }
    const userVisits = await Visit.find({ userId: userId }); // Visit
    for (const vis of userVisits) {
      await vis.deleteOne();
    }
    const userImages = await Image.find({ userId: userId }); // Image
    for (const img of userImages) {
      await img.deleteOne();
    }

    if (notiToken) {
      await sendNotification({
        registrationToken: notiToken,
        title: "We are sad to see you go",
        body: "We wish all the best to you. Always be safe and healthy!",
      });
    }

    res.sendStatus(200);
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

// This controller is just for google play console data safety
exports.getDeleteAccount = async (req, res, next) => {
  const username = req.params.username;
  const password = req.params.password;

  try {
    const foundUser = await User.findOne({ username });
    if (!foundUser)
      return res.status(404).json({
        errorMessage:
          "Could not find username with provided one, username must be included in the URL after '/account/'",
      });

    const hashedPassword = await bcrypt.hash(password, 12);
    if (hashedPassword !== foundUser.password) {
      return res.status(401).json({
        errorMessage:
          "Invalid credentials, username and password must be included in the URL after '/account/'",
      });
    }

    // Now we know that username and password are valid
    res.status(200).json({
      message: "Data Deleted successfully!",
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};
