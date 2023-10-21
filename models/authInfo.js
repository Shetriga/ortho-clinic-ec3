const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const authInfoSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  lastLogin: {
    type: String,
    required: true,
  },
  refreshToken: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Authinfo", authInfoSchema);
