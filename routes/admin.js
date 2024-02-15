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
} = require("../controllers/ownerControllers");

router.post(
  "/visit/image/:vid",
  authorizedAdminOrUser,
  multerHelper,
  postVisitImage
);

router.post("/visit/:aid/:uid", authorizedAdminOrUser, postAddVisit);

router.get("/visitId/:aid", authorizedAdminOrUser, getVisitId);

router.get("/all/appointments", authorizedAdminOrUser, getAllAppointments);

router.get(
  "/appointments/:clinic",
  authorizedAdminOrUser,
  getAppointmentsForClinic
);

router.get(
  "/appointment/details/:aid",
  authorizedAdminOrUser,
  getAppointmentDetails
);

router.patch(
  "/appointment/waiting/:aid",
  authorizedAdminOrUser,
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
  authorizedAdminOrUser,
  putAppointmentValidations,
  putAppointmentDetails
);

router.delete("/appointment/:aid", authorizedAdminOrUser, deleteAppointment);

router.patch(
  "/appointment/done/:aid",
  authorizedAdminOrUser,
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

module.exports = router;
