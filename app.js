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
  "cYMCnYKO6i_qDf_ManQPEh:APA91bF4oHkqy3j2TMNZ40F2Cd5b7v4hCP2STRYnmIRZrzEuCp1fY1hRrzP-MKOvppzlfbkuxvoLLCjjd1V0gQzM7ZL5rzRfQicUsLalU8hgNuylJ5KfWrK_pvgjLbKxfw7D5LSuz4B6";
const options = {
  priority: "high",
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
// mongoose
//   .connect(
//     "mongodb://admin:VewWkgG84v1D21nb@ac-iyhloil-shard-00-00.c7q5eko.mongodb.net:27017,ac-iyhloil-shard-00-01.c7q5eko.mongodb.net:27017,ac-iyhloil-shard-00-02.c7q5eko.mongodb.net:27017/ORTHO?ssl=true&replicaSet=atlas-jria3l-shard-0&authSource=admin&retryWrites=true&w=majority"
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

// When running on wifi
mongoose
  .connect(
    "mongodb+srv://admin:VewWkgG84v1D21nb@cluster0.c7q5eko.mongodb.net/ORTHO?retryWrites=true&w=majority"
  )
  .then(() => {
    app.listen(3000, () => {
      console.clear();
      console.log(`Server is up and running`);
      console.log("Connected to database");
      // tmp();
    });
  })
  .catch((err) => {
    console.log(err);
  });
