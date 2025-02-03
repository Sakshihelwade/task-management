const mongoose = require("mongoose");

// User Schema
const userSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    username: { type: String, required: true },
    mobileNo: { type: Number, require: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: { type: Boolean, required: true, default: true },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);
module.exports = { User };
