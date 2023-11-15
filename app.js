const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const fs = require("fs");
const admin = require("firebase-admin");

let serviceAccount = require("./final.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
let token =
  "c492KxGFQ5uqpSamYb1_2s:APA91bEHHvgQVQqZexuPK1ljrVg7TEtin-MZtymxRGy2DY_uiQZ1WEjxvf63gjVxc-WHZopaKZRt2oml0HR2RX7ZfMbi2rxS4o-xzxOPhrW-BlZ0sMfX7G6njUnb5YWw1j87q0tnpYnw";
const options = {
  priority: "normal",
  timeToLive: 60 * 60 * 24,
};
const payload = {
  notification: {
    title: "New Notification",
    body: "Either you run the day or the day runs you.",
  },
};
const tmp = async () => {
  try {
    console.log("Hi");
    let result = await admin.messaging().sendToDevice(token, payload, options);
    console.log(result);
  } catch (e) {
    console.log(e);
  }
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

// Error Handler
app.use((error, req, res, next) => {
  console.log(error.message);
  if (!error.statusCode) {
    error.statusCode = 500;
  }
  res.status(error.statusCode).json({
    errorMessage: error.message,
  });
});

// When running on mobile hotspot
mongoose
  .connect(
    "mongodb://admin:VewWkgG84v1D21nb@ac-iyhloil-shard-00-00.c7q5eko.mongodb.net:27017,ac-iyhloil-shard-00-01.c7q5eko.mongodb.net:27017,ac-iyhloil-shard-00-02.c7q5eko.mongodb.net:27017/ORTHO?ssl=true&replicaSet=atlas-jria3l-shard-0&authSource=admin&retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000, () => {
      console.clear();
      console.log(`Server is up and running`);
      console.log("Connected to database");
    });
  })
  .catch((err) => {
    console.log(err);
  });

// When running on wifi
// mongoose
//   .connect(
//     "mongodb+srv://admin:VewWkgG84v1D21nb@cluster0.c7q5eko.mongodb.net/ORTHO?retryWrites=true&w=majority"
//   )
//   .then(() => {
//     app.listen(3000, () => {
//       console.clear();
//       console.log(`Server is up and running`);
//       console.log("Connected to database");
//       tmp();
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
