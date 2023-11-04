const express = require("express");
const { authorizedAdmin } = require("../middleware/Authorization");
const {
  postVisitImage,
  postAddVisit,
} = require("../controllers/adminControllers");
const router = express.Router();
const multerHelper = require(".././middleware/multer");

router.post("/visit/image/:vid", authorizedAdmin, multerHelper, postVisitImage);

router.post("/visit/:aid/:uid", authorizedAdmin, postAddVisit);

module.exports = router;
