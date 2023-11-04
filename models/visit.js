const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const visitSchema = new Schema(
  {
    appointmentId: {
      type: mongoose.Types.ObjectId,
      ref: "Appointment",
      required: true,
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrls: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Visit", visitSchema);
