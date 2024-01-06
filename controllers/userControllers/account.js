const User = require("../../models/User");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

exports.patchNotificationToken = async (req, res, next) => {
  const token = req.params.token;

  try {
    const foundUser = await User.findById(req.user.userId);
    foundUser.notificationToken = token;
    await foundUser.save();
    res.status(200).json({
      notificationToken: foundUser.notificationToken,
    });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
};

exports.postDeleteAccount = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { phone, password } = req.body;

  try {
    const foundUser = await User.findOne({ phone });
    if (!foundUser)
      return res
        .status(404)
        .json({ message: "Could not find user with provided phone number" });
    const hashedPassword = await bcrypt.hash(password, 12);
    if (hashedPassword !== foundUser.password)
      return res.status(402).json({ message: "Wrong password" });
    // Now delete the user
    await foundUser.deleteOne();
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }

  res.sendStatus(200);
};
