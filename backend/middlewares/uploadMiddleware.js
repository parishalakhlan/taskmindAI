const multer = require("multer");
const sharp = require("sharp");
const { storage } = require("../config/cloudinary");

const upload = multer({ storage });

const processImage = async (req, res, next) => {
  if (!req.file) return next();

  try {
    // Process image with sharp
    const buffer = await sharp(req.file.path)
      .resize(300, 300)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toBuffer();

    // Upload processed image
    const result = await new Promise((resolve) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image" }, (error, result) => {
          if (error) throw error;
          resolve(result);
        })
        .end(buffer);
    });

    req.file.cloudinaryUrl = result.secure_url;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { upload, processImage };
