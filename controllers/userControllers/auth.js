const {
  generateToken,
  generateRefreshToken,
} = require("../../middleware/token");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const AuthInfo = require("../../models/authInfo");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { sendMail } = require("../../util/nodemailer");
const ResetPassword = require("../../models/resetPassword");

exports.postAddUser = async (req, res, next) => {
  const { username, gender, password, phone } = req.body;

  try {
    const newUser = new User({
      username,
      gender,
      password,
      phone,
    });
    await newUser.save();
  } catch (e) {
    console.log(e.message);
  }
  res.sendStatus(200);
};

exports.postSignup = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { username, password, gender, phone, type } = req.body;
  // console.log(type);

  try {
    // Check if user with same phone already exists
    const userAlreadyExists = await User.findOne({ phone });
    if (userAlreadyExists) return res.sendStatus(409); // 409 means conflict

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username: username.toLowerCase(),
      phone,
      password: hashedPassword,
      gender,
    });
    if (type) {
      newUser.type = type;
    }
    const createdUser = await newUser.save();
    const token = generateToken({
      userId: createdUser._id,
      name: username,
      type: createdUser.type,
    });
    const refreshToken = generateRefreshToken({
      userId: createdUser._id,
      name: username,
      type: createdUser.type,
    });

    const newAuthInfo = new AuthInfo({
      lastLogin: Date.now(),
      refreshToken,
      userId: createdUser._id,
    });
    await newAuthInfo.save();

    res.status(200).json({
      token,
      refreshToken,
      name: username,
      type: createdUser.type,
    });
  } catch (e) {
    const error = new Error(e.message);
    e.statusCode = 500;
    return next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({});

    res.json({
      users,
    });
  } catch (e) {
    console.log(e);
  }
};

exports.postLogin = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { password, username } = req.body;
  let exactUser;
  let token;
  let foundAuthInfo;
  let refreshToken;

  try {
    let foundUsers = await User.find({
      username: username.toLowerCase(),
    }).select("username gender phone type password");
    if (foundUsers.length === 0) {
      foundUsers = await User.find({ phone: username });
      if (foundUsers.length === 0) return res.sendStatus(404);
    }

    for (const user of foundUsers) {
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (passwordIsValid) {
        exactUser = user;
        break;
      }
    }
    if (!exactUser) return res.sendStatus(404);
    token = generateToken({
      userId: exactUser._id,
      name: exactUser.username,
      type: exactUser.type,
    });
    // Get the refresh token from authinfo to send it in res
    foundAuthInfo = await AuthInfo.findOne({ userId: exactUser._id });
    if (!foundAuthInfo) {
      refreshToken = generateRefreshToken({
        userId: exactUser._id,
        name: exactUser.username,
        type: exactUser.type,
      });
      const newAuthInfo = new AuthInfo({
        lastLogin: Date.now(),
        refreshToken,
        userId: exactUser._id,
      });
      await newAuthInfo.save();
    } else {
      refreshToken = foundAuthInfo.refreshToken;
      foundAuthInfo.lastLogin = Date.now();
      await foundAuthInfo.save();
    }
  } catch (e) {
    console.log(e);
  }

  res.status(200).json({
    name: exactUser.username,
    token,
    refreshToken,
    type: exactUser.type,
  });
};

exports.postRefreshToken = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { refreshToken } = req.body;

  try {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, data) => {
        if (err) return res.sendStatus(401);

        //Chech if we have that refresh token in db
        let userRefreshToken = await AuthInfo.findOne({ refreshToken });
        if (userRefreshToken === null) return res.sendStatus(401);

        const token = generateToken({
          userId: data.userId,
          name: data.name,
          type: data.type,
        });
        return res.status(200).json({ token });
      }
    );
  } catch (e) {
    console.log(e);
  }
};

exports.getUserData = async (req, res, next) => {
  let foundUser;

  try {
    foundUser = await User.findById(req.user.userId);

    if (!foundUser) return res.sendStatus(404);
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
  res.status(200).json({
    foundUser,
  });
};

exports.postLogout = async (req, res, next) => {
  try {
    const foundAuthInfo = AuthInfo.findOne({ userId: req.user.userId });
    if (!foundAuthInfo) return res.sendStatus(404);
    await foundAuthInfo.deleteOne();
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
  res.sendStatus(200);
};

exports.postValidateToken = async (req, res, next) => {
  res.sendStatus(200);
};

exports.postResetPassword = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { phone, email } = req.body;
  try {
    const foundUser = await User.findOne({ phone });
    if (!foundUser) return res.sendStatus(404);

    const foundReset = await ResetPassword.findOne({ phone });

    const code = Math.floor(Math.random() * 90000) + 10000;
    sendMail({ reciever: email, code: code });
    if (!foundReset) {
      const newResetPassword = new ResetPassword({
        code,
        phone,
      });
      await newResetPassword.save();
    } else {
      foundReset.code = code;
      await foundReset.save();
    }
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }

  res.sendStatus(201);
};

exports.postNewPassword = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { phone, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return res.sendStatus(422);
  }

  try {
    const foundUser = await User.findOne({ phone });
    if (!foundUser) return res.sendStatus(404);

    const hashedPassword = await bcrypt.hash(password, 12);
    foundUser.password = hashedPassword;
    await foundUser.save();
    const foundReset = await ResetPassword.findOne({ phone });
    await foundReset.deleteOne();
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }

  res.sendStatus(200);
};

exports.postValidateCode = async (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { phone, code } = req.body;
  try {
    const foundReset = await ResetPassword.findOne({ phone });
    if (!foundReset) return res.sendStatus(404);

    // Now we know that we found the reset password document
    if (foundReset.code !== parseInt(code)) {
      return res.sendStatus(422);
    }
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }

  res.sendStatus(200);
};
