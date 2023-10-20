const express = require("express");
const { postAddUser } = require("../controllers/userControllers/auth");
const router = express.Router();

router.post("/", postAddUser);

module.exports = router;
