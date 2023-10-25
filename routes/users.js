const express = require("express");
const {
  postAddUser,
  getUserData,
} = require("../controllers/userControllers/auth");
const { authorizedUser } = require("../middleware/Authorization");
const router = express.Router();

router.post("/", postAddUser);

router.get("/data/:uid", authorizedUser, getUserData);

module.exports = router;
