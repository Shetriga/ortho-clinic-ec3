const express = require("express");
const { authorizedAdmin } = require("../middleware/Authorization");
const {
  postVisitImage,
  postAddVisit,
  getAllAppointments,
  getAppointmentDetails,
  patchAppointmentWaiting,
  patchAppointmentDone,
  getVisitId,
  deleteAppointment,
  getAppointmentsForClinic,
  postAppointmentAlreadyExists,
} = require("../controllers/adminControllers");
const router = express.Router();
const multerHelper = require(".././middleware/multer");
const {
  patchNotificationToken,
} = require("../controllers/userControllers/account");
const { appointmentCheckValidations } = require("../validation/admin");

router.post("/visit/image/:vid", authorizedAdmin, multerHelper, postVisitImage);

router.post("/visit/:aid/:uid", authorizedAdmin, postAddVisit);

router.get("/visitId/:aid", authorizedAdmin, getVisitId);

router.get("/all/appointments", authorizedAdmin, getAllAppointments);

router.get("/appointments/:clinic", authorizedAdmin, getAppointmentsForClinic);

router.get("/appointment/details/:aid", authorizedAdmin, getAppointmentDetails);

router.patch(
  "/appointment/waiting/:aid",
  authorizedAdmin,
  patchAppointmentWaiting
);

router.post(
  "/appointment/check",
  authorizedAdmin,
  appointmentCheckValidations,
  postAppointmentAlreadyExists
);

router.delete("/appointment/:aid", authorizedAdmin, deleteAppointment);

router.patch("/appointment/done/:aid", authorizedAdmin, patchAppointmentDone);

router.patch(
  "/notificationToken/:token",
  authorizedAdmin,
  patchNotificationToken
);

module.exports = router;
