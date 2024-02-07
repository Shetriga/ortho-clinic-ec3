const express = require("express");
const {
  postAddUser,
  getUserData,
} = require("../controllers/userControllers/auth");
const {
  authorizedUser,
  authorizedAdminOrUser,
  authorizedAdminOrUserOrOwner,
  authorizedUserOrOwner,
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
  putAccountInfo,
  deleteAccount,
  getDeleteAccount,
} = require("../controllers/userControllers/account");
const {
  deleteAccountValidations,
  putAccountInfoValidations,
} = require("../validation/account");
const router = express.Router();

router.post("/", postAddUser);

router.get("/data", authorizedAdminOrUserOrOwner, getUserData);

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

router.put(
  "/account/info",
  authorizedAdminOrUser,
  putAccountInfoValidations,
  putAccountInfo
);

router.post("/delete/account", deleteAccountValidations, postDeleteAccount);

router.delete("/account", authorizedUser);

router.get(
  "/appointment/details/:aid",
  authorizedAdminOrUserOrOwner,
  getAppointmentDetails
);

router.get("/visit/images/:aid", authorizedUserOrOwner, getVisitImages);

router.delete("/account", authorizedUser, deleteAccount);

// Get route just for google play console so that it is easier for users to delete their accounts
router.get("/delete/account/:username/:password", getDeleteAccount);

module.exports = router;
