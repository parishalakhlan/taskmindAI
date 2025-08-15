const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const Profile = require("../models/Profile");
const bcrypt = require("bcryptjs");
const OTP = require("../models/Otp");
const { sendOTPEmail } = require("../utils/emailerSender");

const signToken = (id) => {
  return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// In your auth controller (where you create profiles)
// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Send OTP for Signup
const sendSignupOTP = async (req, res) => {
  const { email, name, password } = req.body;
  console.log("checking signup OTP");
  try {
    // Validate input
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email and purpose
    await OTP.deleteMany({ email, purpose: "signup" });

    // Create new OTP record
    await OTP.create({
      email,
      otp,
      purpose: "signup",
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    res.json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Send signup OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// Verify OTP and Complete Signup
const verifySignupOTP = async (req, res) => {
  const { email, name, password, passwordConfirm, otp } = req.body; // Added passwordConfirm here

  try {
    if (!email || !name || !password || !passwordConfirm || !otp) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (email, name, password, passwordConfirm, OTP) are required.",
      });
    }
    if (password !== passwordConfirm) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match.",
      });
    }
    // Find OTP record
    const otpRecord = await OTP.findOne({
      email,
      purpose: "signup",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ email, purpose: "signup" });
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP",
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      await OTP.findOneAndUpdate(
        { email, purpose: "signup" },
        { $inc: { attempts: 1 } }
      );
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      passwordConfirm, // Must be included to pass validation
      isVerified: true,
    });

    // Delete OTP record
    await OTP.deleteOne({ email, purpose: "signup" });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Verify signup OTP error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

// Send OTP for Login
const sendLoginOTP = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Delete any existing OTP for this email and purpose
    await OTP.deleteMany({ email, purpose: "login" });

    // Create new OTP record
    await OTP.create({
      email,
      otp,
      purpose: "login",
    });

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email",
      });
    }

    res.json({
      success: true,
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Send login OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
    });
  }
};

// Verify OTP and Complete Login
const verifyLoginOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    // Find OTP record
    const otpRecord = await OTP.findOne({
      email,
      purpose: "login",
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired",
      });
    }

    // Check attempts
    if (otpRecord.attempts >= 3) {
      await OTP.deleteOne({ email, purpose: "login" });
      return res.status(400).json({
        success: false,
        message: "Too many failed attempts. Please request a new OTP",
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      await OTP.findOneAndUpdate(
        { email, purpose: "login" },
        { $inc: { attempts: 1 } }
      );
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete OTP record
    await OTP.deleteOne({ email, purpose: "login" });

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error("Verify login OTP error:", error);
    res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

const signup = async (req, res, next) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    const existingProfile = await Profile.findOne({ user: newUser._id });
    if (!existingProfile) {
      await Profile.create({
        user: newUser._id,
        bio: "",
        skills: [],
      });
    }

    const token = signToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // 3) If everything ok, send token to client
    const token = signToken(user._id);

    res.status(200).json({
      status: "success",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        // other user fields
      },
    });
  } catch (err) {
    next(err);
  }
};

// Check auth status
const checkAuth = async (req, res) => {
  console.log("checkAuth function hitting");
  res.set({
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  });

  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ isAuthenticated: false, message: "Token missing" });
    }

    const token = authHeader.split(" ")[1];
    console.log("token", token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res
        .status(401)
        .json({ isAuthenticated: false, message: "User not found" });
    }
    console.log("user", user);
    console.log("user data", user.data);
    res.json({
      isAuthenticated: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res
      .status(401)
      .json({ isAuthenticated: false, message: "Invalid or expired token" });
  }
};

module.exports = {
  checkAuth,
  signup,
  login,
  sendSignupOTP,
  verifySignupOTP,
  sendLoginOTP,
  verifyLoginOTP,
};
