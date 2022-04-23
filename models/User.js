const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    require: [true, "User must have name"],
  },
  class: {
    type: String,
    require: [true, "User must have class"],
  },
  studentCode: {
    type: String,
    require: [true, "User must have student code"],
  },
  role: {
    type: String,
    default: "candidate",
    enum: ["candidate", "interviewer"],
  },
  point: Number,
  comment: String,
  password: String,
  qrCode: String,
});

module.exports = mongoose.model("users", userSchema);
