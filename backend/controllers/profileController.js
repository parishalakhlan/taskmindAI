const Profile = require("../models/Profile");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

// Get current user's profile
exports.getMyProfile = catchAsync(async (req, res, next) => {
  let profile = await Profile.findOne({ user: req.user._id }).populate("user", [
    "name",
    "email",
    "createdAt",
  ]);

  // If no profile exists, create one
  if (!profile) {
    profile = await Profile.create({
      user: req.user._id,
      bio: "",
      skills: [],
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});
// Create or update profile
exports.updateProfile = catchAsync(async (req, res, next) => {
  const profileFields = {
    user: req.user.id,
    bio: req.body.bio,
    website: req.body.website,
    location: req.body.location,
    skills: req.body.skills.split(",").map((skill) => skill.trim()),
    social: req.body.social,
  };

  let profile = await Profile.findOne({ user: req.user._id });

  if (profile) {
    // Update existing profile
    profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { $set: profileFields },
      { new: true, runValidators: true }
    );
  } else {
    // Create new profile
    profile = await Profile.create(profileFields);
  }

  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});

// Get all profiles
exports.getAllProfiles = catchAsync(async (req, res, next) => {
  const profiles = await Profile.find().populate("user", ["name", "email"]);

  res.status(200).json({
    status: "success",
    results: profiles.length,
    data: {
      profiles,
    },
  });
});
// Add this to your profileController
exports.updateBasicInfo = catchAsync(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: { user },
  });
});
// Get profile by user ID
exports.getProfileByUserId = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.params.userId }).populate(
    "user",
    ["name", "email"]
  );

  if (!profile) {
    return next(new AppError("No profile found for this user ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});

// Delete profile and user
exports.deleteProfile = catchAsync(async (req, res, next) => {
  // Remove profile
  await Profile.findOneAndRemove({ user: req.user._id });
  // Remove user
  await User.findOneAndRemove({ _id: req.user._id });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
