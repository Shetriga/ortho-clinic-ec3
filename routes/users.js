const express = require("express");
const {
  postAddUser,
  getUserData,
} = require("../controllers/userControllers/auth");
const {
  authorizedUser,
  authorizedAdminOrUser,
} = require("../middleware/Authorization");
const {
  postNewAppointment,
  getAppointments,
  deleteAppointment,
  getAppointmentDetails,
} = require("../controllers/userControllers/appointment");
const { postNewAppointmentValidation } = require("../validation/appointment");
const { getVisitImages } = require("../controllers/userControllers/visit");
const {
  patchNotificationToken,
  postDeleteAccount,
} = require("../controllers/userControllers/account");
const { deleteAccountValidations } = require("../validation/account");
const router = express.Router();

router.post("/", postAddUser);

router.get("/data", authorizedAdminOrUser, getUserData);

router.patch(
  "/notificationToken/:token",
  authorizedUser,
  patchNotificationToken
);

router.get("/appointments", authorizedUser, getAppointments);

router.delete("/appointment/:aid", authorizedUser, deleteAppointment);

router.post(
  "/appointment",
  authorizedUser,
  postNewAppointmentValidation,
  postNewAppointment
);

router.post("/delete/account", deleteAccountValidations, postDeleteAccount);

router.get("/appointment/details/:aid", authorizedUser, getAppointmentDetails);

router.get("/visit/images/:aid", authorizedUser, getVisitImages);

module.exports = router;
