const express = require("express");
const {
  postAddUser,
  getUserData,
} = require("../controllers/userControllers/auth");
const { authorizedUser } = require("../middleware/Authorization");
const {
  postNewAppointment,
  getAppointments,
  deleteAppointment,
  getAppointmentDetails,
} = require("../controllers/userControllers/appointment");
const { postNewAppointmentValidation } = require("../validation/appointment");
const { getVisitImages } = require("../controllers/userControllers/visit");
const router = express.Router();

router.post("/", postAddUser);

router.get("/data", authorizedUser, getUserData);

router.get("/appointments", authorizedUser, getAppointments);

router.delete("/appointment/:aid", authorizedUser, deleteAppointment);

router.post(
  "/appointment",
  authorizedUser,
  postNewAppointmentValidation,
  postNewAppointment
);

router.get("/appointment/details/:aid", authorizedUser, getAppointmentDetails);

router.get("/visit/images/:aid", authorizedUser, getVisitImages);

module.exports = router;
