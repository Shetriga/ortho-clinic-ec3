const express = require("express");
const app = express();
const mongoose = require("mongoose");
const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const bodyParser = require("body-parser");
require("dotenv").config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

mongoose
  .connect(
    "mongodb+srv://admin:admin@cluster0.c7q5eko.mongodb.net/ORTHO?retryWrites=true&w=majority"
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
