const jwt = require("jsonwebtoken");

// Authorized User
exports.authorizedUser = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(403);

  try {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      if (user.type === "Patient") {
        req.user = user;
        next();
      } else {
        return res.sendStatus(401);
      }
    });
  } catch (e) {
    return res.sendStatus(403);
  }
};

// Authorized Admin
exports.authorizedAdmin = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(403);

  try {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      if (user.type === "Admin") {
        req.user = user;
        next();
      } else {
        return res.sendStatus(401);
      }
    });
  } catch (e) {
    return res.sendStatus(403);
  }
};

// Authorized Owner
exports.authorizedOwner = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(403);

  try {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      if (user.type === "Owner") {
        req.user = user;
        next();
      } else {
        return res.sendStatus(401);
      }
    });
  } catch (e) {
    return res.sendStatus(403);
  }
};

// Authorized Admin or User
exports.authorizedAdminOrUser = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(403);

  try {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      if (user.type === "Admin" || user.type === "Patient") {
        req.user = user;
        next();
      } else {
        return res.sendStatus(401);
      }
    });
  } catch (e) {
    return res.sendStatus(403);
  }
};

// Authorized Admin or User or Owner
exports.authorizedAdminOrUserOrOwner = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(403);

  try {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      if (
        user.type === "Admin" ||
        user.type === "Patient" ||
        user.type === "Owner"
      ) {
        req.user = user;
        next();
      } else {
        return res.sendStatus(401);
      }
    });
  } catch (e) {
    return res.sendStatus(403);
  }
};

// Authorized User or Owner
exports.authorizedUserOrOwner = async (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.sendStatus(403);

  try {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);

      if (user.type === "Patient" || user.type === "Owner") {
        req.user = user;
        next();
      } else {
        return res.sendStatus(401);
      }
    });
  } catch (e) {
    return res.sendStatus(403);
  }
};
