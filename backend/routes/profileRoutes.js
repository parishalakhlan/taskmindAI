const express = require("express");
const profileController = require("../controllers/profileController");
const authMiddleware = require("../middlewares/authMiddleware");
const { upload, processImage } = require("../middlewares/uploadMiddleware");
const photoController = require("../controllers/photoController");

const router = express.Router();

// Protect all routes with authentication
router.use(authMiddleware);

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", profileController.getMyProfile);

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post("/", profileController.updateProfile);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", profileController.getAllProfiles);

// @route   GET api/profile/user/:userId
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:userId", profileController.getProfileByUserId);

// @route   DELETE api/profile
// @desc    Delete profile and user
// @access  Private
router.delete("/", profileController.deleteProfile);
router.patch(
  "/photo",
  upload.single("photo"),
  processImage,
  photoController.uploadPhoto
);

router.delete("/photo", photoController.deletePhoto);

module.exports = router;
