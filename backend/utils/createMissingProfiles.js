const User = require("../models/userModel");
const Profile = require("../models/Profile");
const mongoose = require("mongoose");
require("dotenv").config();

const migrateProfiles = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const usersWithoutProfiles = await User.aggregate([
    {
      $lookup: {
        from: "profiles",
        localField: "_id",
        foreignField: "user",
        as: "profile",
      },
    },
    {
      $match: {
        profile: { $size: 0 },
      },
    },
  ]);

  if (usersWithoutProfiles.length === 0) {
    console.log("All users have profiles!");
    process.exit();
  }

  console.log(`Creating profiles for ${usersWithoutProfiles.length} users...`);

  const profileCreations = usersWithoutProfiles.map((user) =>
    Profile.create({
      user: user._id,
      bio: `Hi I'm ${user.name}`,
      skills: [],
    })
  );

  await Promise.all(profileCreations);
  console.log("Profiles created successfully!");
  process.exit();
};

migrateProfiles();
