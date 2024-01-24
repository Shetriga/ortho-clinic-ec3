const express = require("express");
const {
  authorizedAdmin,
  authorizedAdminOrUser,
  authorizedAdminOrUserOrOwner,
  authorizedOwner,
} = require("../middleware/Authorization");
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
  putAppointmentDetails,
} = require("../controllers/adminControllers");
const router = express.Router();
const multerHelper = require(".././middleware/multer");
const {
  patchNotificationToken,
} = require("../controllers/userControllers/account");
const {
  appointmentCheckValidations,
  putAppointmentValidations,
} = require("../validation/admin");
const { patientDataByIdValidations } = require("../validation/owner");
const { getPatientDataById } = require("../controllers/ownerControllers");

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
  authorizedAdminOrUser,
  appointmentCheckValidations,
  postAppointmentAlreadyExists
);

router.put(
  "/appointment/details/:aid",
  authorizedAdmin,
  putAppointmentValidations,
  putAppointmentDetails
);

router.delete("/appointment/:aid", authorizedAdmin, deleteAppointment);

router.patch("/appointment/done/:aid", authorizedAdmin, patchAppointmentDone);

router.patch(
  "/notificationToken/:token",
  authorizedAdminOrUserOrOwner,
  patchNotificationToken
);

router.post(
  "/patient/data/id",
  authorizedOwner,
  patientDataByIdValidations,
  postPatientDataById
);

module.exports = router;
