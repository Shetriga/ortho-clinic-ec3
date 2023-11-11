const express = require("express");
const { authorizedAdmin } = require("../middleware/Authorization");
const {
  postVisitImage,
  postAddVisit,
  getAllAppointments,
  getAppointmentDetails,
  patchAppointmentWaiting,
  patchAppointmentDone,
} = require("../controllers/adminControllers");
const router = express.Router();
const multerHelper = require(".././middleware/multer");

router.post("/visit/image/:vid", authorizedAdmin, multerHelper, postVisitImage);

router.post("/visit/:aid/:uid", authorizedAdmin, postAddVisit);

router.get("/all/appointments", authorizedAdmin, getAllAppointments);

router.get("/appointment/details/:aid", authorizedAdmin, getAppointmentDetails);

router.patch(
  "/appointment/waiting/:aid",
  authorizedAdmin,
  patchAppointmentWaiting
);

router.patch("/appointment/done/:aid", authorizedAdmin, patchAppointmentDone);

module.exports = router;
