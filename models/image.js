const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  visitId: {
    type: mongoose.Types.ObjectId,
    ref: "Visit",
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Image", imageSchema);
