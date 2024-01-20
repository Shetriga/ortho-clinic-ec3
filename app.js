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
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cron = require("node-cron");
const { notifyUsers } = require("./controllers/userControllers/appointment");
const User = require("./models/User");

async function getLatestMax() {
  const maxId = await User.find({}).sort({ patientId: -1 }).limit(1);
  // console.log(maxId[0].patientId);
  return maxId[0].patientId;
}
// tmp();
assignIds();

async function assignIds() {
  const allUsers = await User.find({ type: "Patient" });
  for (let p of allUsers) {
    p.patientId--;
    await p.save();
    // console.log(p.patientId);
    // const latestMax = await getLatestMax();
    // console.log(p.patientId);
    // if (!p.patientId) {
    // p.patientId = latestMax + 1;
    // await p.save();
    // console.log("done");
    // }
    // console.log(latestMax);
    // console.log(p);
  }
}

cron.schedule("0 0 */3 * * *", () => {
  notifyUsers();
});

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

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("disconnected");
  });
  console.log("A device connected");
  // io.emit("6558627f8eb432821e2b2e1c", "Now we are talking");
});

const socketIoObject = io;
module.exports.ioObject = socketIoObject;

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
//     server.listen(3000, () => {
//       console.clear();
//       console.log(`Server is up and running`);
//       console.log("Connected to database");
//       // tmp();
//     });
//   })
//   .catch((err) => {
//     console.log(err);
//   });
