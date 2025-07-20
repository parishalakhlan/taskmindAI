const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  bio: {
    type: String,
    maxlength: 500,
    trim: true,
  },
  website: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
          v
        );
      },
      message: (props) => `${props.value} is not a valid website URL!`,
    },
  },
  location: {
    type: String,
    trim: true,
  },
  skills: {
    type: [String],
    validate: {
      validator: function (v) {
        return v.length <= 10;
      },
      message: "Skills cannot exceed 10 items!",
    },
  },
  social: {
    twitter: String,
    linkedin: String,
    github: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  photoCloudinaryId: String,
});

// Create profile automatically when user is created
profileSchema.post("save", function (doc) {
  console.log(`Profile created for user ${doc.user}`);
});

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
