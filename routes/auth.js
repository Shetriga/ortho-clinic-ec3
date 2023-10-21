const express = require("express");
const {
  postSignup,
  getAllUsers,
  postLogin,
  postRefreshToken,
} = require("../controllers/userControllers/auth");
const { tokenValidation } = require("../validation/token");
const {
  postLoginValidation,
  postSignUpValidation,
} = require("../validation/auth");
const router = express.Router();

router.post("/signup", postSignUpValidation, postSignup);

router.get("/all/users", getAllUsers);

router.post("/login", postLoginValidation, postLogin);

router.post("/refreshToken", tokenValidation, postRefreshToken);

module.exports = router;
