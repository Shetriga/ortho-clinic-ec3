const express = require("express");
const {
  postSignup,
  getAllUsers,
  postLogin,
  postRefreshToken,
  postLogout,
  postValidateToken,
  postResetPassword,
  postNewPassword,
  postValidateCode,
} = require("../controllers/userControllers/auth");
const { tokenValidation } = require("../validation/token");
const {
  postLoginValidation,
  postSignUpValidation,
  logoutValidation,
} = require("../validation/auth");
const {
  authorizedUser,
  authorizedAdminOrUser,
  authorizedAdminOrUserOrOwner,
} = require("../middleware/Authorization");
const {
  resetPasswordValidations,
  newPasswordValidations,
  resetCodeValidations,
} = require("../validation/account");
const router = express.Router();

router.post("/signup", postSignUpValidation, postSignup);

router.get("/all/users", getAllUsers);

router.post("/login", postLoginValidation, postLogin);

router.post("/refreshToken", tokenValidation, postRefreshToken);

router.post("/validate/token", authorizedAdminOrUserOrOwner, postValidateToken);

router.post("/logout", authorizedAdminOrUserOrOwner, postLogout);

router.post("/reset/password", resetPasswordValidations, postResetPassword);

router.post("/validate/code", resetCodeValidations, postValidateCode);

router.post("/new/password", newPasswordValidations, postNewPassword);

module.exports = router;
