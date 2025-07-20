const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "A task must have a title"],
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  dueDate: {
    type: Date,
    validate: {
      validator: function (value) {
        return value > Date.now();
      },
      message: "Due date must be in the future",
    },
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Task must belong to a user"],
  },
});

// Update the updatedAt field before saving
taskSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = {
  TaskModel,
  PRIORITY_ENUM: taskSchema.path("priority").enumValues,
};
