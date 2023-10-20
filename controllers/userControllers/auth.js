const {
  generateToken,
  generateRefreshToken,
} = require("../../middleware/token");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const AuthInfo = require("../../models/authInfo");

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
  const { name, password, gender, phone, type } = req.body;
  // console.log(type);

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      username: name,
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
      name: name,
      type: createdUser.type,
    });
    const refreshToken = generateRefreshToken({
      userId: createdUser._id,
      name: name,
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
    });
  } catch (e) {
    console.log(e);
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
  const { password } = req.body;

  try {
    const passwordIsValid = await bcrypt.compare(
      password,
      "$2a$12$l3VIxEFyLHemZsgAuHjvAeXoS3MuYO/m2.eavSo9g3vehYmewJE3u"
    );
    console.log(passwordIsValid);
    if (!passwordIsValid) return res.sendStatus(401);
  } catch (e) {
    console.log(e);
  }

  res.sendStatus(200);
};
