const mongoose = require("mongoose");

const OTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      required: true,
    },
    purpose: {
      type: String,
      enum: ["signup", "login", "password-reset"],
      default: "signup",
    },
    attempts: {
      type: Number,
      default: 0,
      max: 3,
    },
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
OTPSchema.index({ email: 1, otp: 1 }, { unique: true });

module.exports = mongoose.model("OTP", OTPSchema);
