const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const Profile = require("../models/Profile");
const signToken = (id) => {
  return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// In your auth controller (where you create profiles)

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

module.exports = { checkAuth, signup, login };
