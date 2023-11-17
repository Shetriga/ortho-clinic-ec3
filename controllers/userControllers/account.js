const User = require("../../models/User");

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
