const jwt = require("jsonwebtoken");
const User = require("../models/userModel"); // Add this import
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const mongoose = require("mongoose");
module.exports = catchAsync(async (req, res, next) => {
  console.log("Auth middleware hit for:", req.path); // ADD THIS
  try {
    // 1) Get token and check if it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
    console.log("Token: is here", token);

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log("find by id working fine", decoded);
    // 3) Check if user still exists
    const currentUser = await User.findById(
      new mongoose.Types.ObjectId(decoded.id)
    );

    console.log("Current user:", currentUser);
    if (!currentUser) {
      return next(
        new AppError("The user belonging to this token no longer exists.", 401)
      );
    }

    // 4) Grant access to protected route
    req.user = currentUser;
    next();
  } catch (err) {
    next(err);
  }
});
