const {
  generateToken,
  generateRefreshToken,
} = require("../../middleware/token");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const AuthInfo = require("../../models/authInfo");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

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
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username,
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
      username,
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

  try {
    const foundUsers = await User.find({ username }).select(
      "username gender phone type password"
    );
    if (foundUsers.length === 0) {
      return res.sendStatus(404);
    }

    for (const user of foundUsers) {
      const passwordIsValid = await bcrypt.compare(password, user.password);
      if (passwordIsValid) {
        exactUser = user;
        break;
      }
    }
    if (!exactUser) return res.sendStatus(404);
    token = await generateToken({
      userId: exactUser._id,
      name: exactUser.username,
      type: exactUser.type,
    });
  } catch (e) {
    console.log(e);
  }

  res.status(200).json({ name: exactUser.username, token });
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
  const userId = req.params.uid;
  let foundUser;

  try {
    foundUser = await User.findById(userId);

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
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(401).json({
      errorMessage: `Validation error: ${result.errors[0].msg}`,
    });
  }

  const { refreshToken } = req.body;

  try {
    await AuthInfo.deleteOne({ refreshToken });
  } catch (e) {
    const error = new Error(e.message);
    error.statusCode = 500;
    return next(error);
  }
  res.sendStatus(200);
};
