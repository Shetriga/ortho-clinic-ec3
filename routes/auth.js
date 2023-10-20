const express = require("express");
const {
  postSignup,
  getAllUsers,
  postLogin,
} = require("../controllers/userControllers/auth");
const router = express.Router();

router.post("/signup", postSignup);

router.get("/all/users", getAllUsers);

router.post("/login", postLogin);

module.exports = router;
