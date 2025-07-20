const Profile = require("../models/Profile");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.uploadPhoto = catchAsync(async (req, res, next) => {
  if (!req.file.cloudinaryUrl) {
    return next(new AppError("Please upload an image", 400));
  }

  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    {
      photo: req.file.cloudinaryUrl,
      photoCloudinaryId: req.file.public_id,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      photo: profile.photo,
    },
  });
});

exports.deletePhoto = catchAsync(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id });

  if (profile.photoCloudinaryId) {
    await cloudinary.uploader.destroy(profile.photoCloudinaryId);
  }

  profile.photo = "default.jpg";
  profile.photoCloudinaryId = undefined;
  await profile.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
