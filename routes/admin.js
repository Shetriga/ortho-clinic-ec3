const express = require("express");
const { authorizedAdmin } = require("../middleware/Authorization");
const {
  postVisitImage,
  postAddVisit,
  getAllAppointments,
} = require("../controllers/adminControllers");
const router = express.Router();
const multerHelper = require(".././middleware/multer");

router.post("/visit/image/:vid", authorizedAdmin, multerHelper, postVisitImage);

router.post("/visit/:aid/:uid", authorizedAdmin, postAddVisit);

router.get("/all/appointments", authorizedAdmin, getAllAppointments);

module.exports = router;
