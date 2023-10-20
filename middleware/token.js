const jwt = require("jsonwebtoken");

exports.generateToken = ({ userId, name, type }) => {
  const token = jwt.sign({ userId, name, type }, "process.env.TOKEN_SECRET", {
    expiresIn: "1h",
  });
  return token;
};

exports.generateRefreshToken = ({ userId, name, type }) => {
  const refreshToken = jwt.sign(
    { userId, name, type },
    "process.env.TOKEN_SECRET",
    {
      expiresIn: "90d",
    }
  );
  return refreshToken;
};
