const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const resetPasswordSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    code: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Resetpassword", resetPasswordSchema);
