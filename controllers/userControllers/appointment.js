const { validationResult } = require("express-validator");
const Appointment = require("../../models/appointment");
const { sendNotification } = require("../../util/notification");
const User = require("../../models/User");
const socket = require("../../app");

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
    // First check if we have conflict with another appointment
    const appointmentAlreadyExists = await Appointment.findOne({ date, time });
    if (appointmentAlreadyExists) return res.sendStatus(409);

    const newAppointment = new Appointment({
      userId: req.user.userId,
      name,
      phone,
      date,
      time,
      clinic,
    });

    await newAppointment.save();
    // Send push notification for the user
    // First get the notification token for the user
    const foundUser = await User.findById(req.user.userId);
    const notiToken = foundUser.notificationToken;
    // Now send the notifications token
    await sendNotification({
      registrationToken: notiToken,
      title: "تم الحجـز بنجاح",
      body: "ستقوم العيادة بالتوصل معك لتأكيد الحجز",
    });

    // Now send notification for the corresponding admin
    const foundAdmin = await User.findOne({
      type: "Admin",
      adminClinic: clinic,
    });
    const adminNotiToken = foundAdmin.notificationToken;
    await sendNotification({
      registrationToken: adminNotiToken,
      title: "حجـز جديد",
      body: `Name: ${name} - Date: ${date} - Time: ${time}`,
    });
    socket.ioObject.emit(foundAdmin._id.toString(), {
      name: name,
      date,
      time: time,
    });
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

exports.deleteAppointment = async (req, res, next) => {
  const appointmentId = req.params.aid;
  try {
    const foundAppointment = await Appointment.findById(appointmentId);
    if (!foundAppointment) return res.sendStatus(404);
    if (req.user.userId !== foundAppointment.userId.toString())
      return res.sendStatus(401);
    await foundAppointment.deleteOne();
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
  res.sendStatus(200);
};

exports.getAppointmentDetails = async (req, res, next) => {
  const appointmentId = req.params.aid;

  try {
    const foundAppointment = await Appointment.findById(appointmentId);
    if (!foundAppointment) return res.sendStatus(404);
    if (foundAppointment.userId.toString() !== req.user.userId)
      return res.sendStatus(401);

    res.status(200).json({
      name: foundAppointment.name,
      clinic: foundAppointment.clinic,
      tmie: foundAppointment.time,
      date: foundAppointment.date,
      phone: foundAppointment.phone,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.notifyUsers = async (req, res, next) => {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = dd + "/" + mm + "/" + yyyy;
  try {
    const sadatFoundAppointments = await Appointment.find({
      date: formattedToday,
      clinic: "Sadat",
      notified: false,
      $or: [{ status: "Pending" }, { status: "Waiting" }],
    }).populate("userId");
    const octoberFoundAppointments = await Appointment.find({
      date: formattedToday,
      clinic: "October",
      notified: false,
      $or: [{ status: "Pending" }, { status: "Waiting" }],
    }).populate("userId");

    // Send push notifications for users of Sadat clinic and October clinic
    for (let sadatApp of sadatFoundAppointments) {
      const notiToken = sadatApp.userId.notificationToken;
      await sendNotification({
        registrationToken: notiToken,
        title: "تذكيـر",
        body: `تذكير بزيارة اليوم الساعة ${sadatApp.time} عيادة السادات.`,
      });
      sadatApp.notified = true;
      await sadatApp.save();
    }
    for (let octoberApp of octoberFoundAppointments) {
      const notiToken = octoberApp.userId.notificationToken;
      await sendNotification({
        registrationToken: notiToken,
        title: "تذكيـر",
        body: `تذكير بزيارة اليوم الساعة ${octoberApp.time} عيادة أكتوبر.`,
      });
      octoberApp.notified = true;
      await octoberApp.save();
    }
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};
