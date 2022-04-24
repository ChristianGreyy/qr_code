const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});
userSchema.methods.isMatchPassword = async function (password) {
  const isMatched = await bcrypt.compare(password, this.password);

  return isMatched;
};

userSchema.methods.signToken = function () {
  return jwt.sign({ id: this._id }, process.env.TOKEN_SECRET, {
    expiresIn: process.env.TOKEN_EXPIRE,
  });
};

module.exports = mongoose.model("users", userSchema);
