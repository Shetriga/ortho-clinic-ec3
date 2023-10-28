const express = require("express");
const {
  postAddUser,
  getUserData,
} = require("../controllers/userControllers/auth");
const { authorizedUser } = require("../middleware/Authorization");
const {
  postNewAppointment,
} = require("../controllers/userControllers/appointment");
const { postNewAppointmentValidation } = require("../validation/appointment");
const router = express.Router();

router.post("/", postAddUser);

router.get("/data", authorizedUser, getUserData);

router.post(
  "/appointment",
  authorizedUser,
  postNewAppointmentValidation,
  postNewAppointment
);

module.exports = router;
