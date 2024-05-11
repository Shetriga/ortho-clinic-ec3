const express = require("express");
const {
  authorizedAdmin,
  authorizedAdminOrUser,
  authorizedAdminOrUserOrOwner,
  authorizedOwner,
  authorizedAdminOrOwner,
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
const {
  patientDataByIdValidations,
  patientDataByPhoneValidations,
  patientDataByNameValidations,
  patientDataByIdAndPhoneValidations,
} = require("../validation/owner");
const {
  getPatientDataById,
  postPatientDataById,
  postPatientDataByPhone,
  postPatientDataByName,
  getUserDataByOwner,
  getUserAppointmentsByOwner,
  postPatientDataByIdAndPhone,
  cancelDay,
} = require("../controllers/ownerControllers");

router.post(
  "/visit/image/:vid",
  authorizedAdminOrOwner,
  multerHelper,
  postVisitImage
);

router.post("/visit/:aid/:uid", authorizedAdminOrOwner, postAddVisit);

router.get("/visitId/:aid", authorizedAdminOrOwner, getVisitId);

router.get("/all/appointments", authorizedAdminOrOwner, getAllAppointments);

router.get(
  "/appointments/:clinic",
  authorizedAdminOrOwner,
  getAppointmentsForClinic
);

router.get(
  "/appointment/details/:aid",
  authorizedAdminOrOwner,
  getAppointmentDetails
);

router.patch(
  "/appointment/waiting/:aid",
  authorizedAdminOrOwner,
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
  authorizedAdminOrOwner,
  putAppointmentValidations,
  putAppointmentDetails
);

router.delete("/appointment/:aid", authorizedAdminOrOwner, deleteAppointment);

router.patch(
  "/appointment/done/:aid",
  authorizedAdminOrOwner,
  patchAppointmentDone
);

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

router.post(
  "/patient/data/phone",
  authorizedOwner,
  patientDataByPhoneValidations,
  postPatientDataByPhone
);

router.post(
  "/patient/data/name",
  authorizedOwner,
  patientDataByNameValidations,
  postPatientDataByName
);

router.post(
  "/patient/data/idAndPhone",
  authorizedOwner,
  patientDataByIdAndPhoneValidations,
  postPatientDataByIdAndPhone
);

router.get("/user/data/:uid", authorizedOwner, getUserDataByOwner);

router.get(
  "/user/appointments/:uid",
  authorizedOwner,
  getUserAppointmentsByOwner
);

router.get("/cancel/day/:day(*)", authorizedOwner, cancelDay);

module.exports = router;
