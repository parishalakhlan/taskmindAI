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

  deadline: {
    // Changed from dueDate to deadline
    type: Date,
    validate: {
      validator: function (value) {
        return value > Date.now();
      },
      message: "Deadline must be in the future", // Updated message
    },
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "Low", "Medium", "High"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
    default: null,
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
  // Add to your existing Task schema
  boardId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
    default: null,
  }, // which board this task belongs to
  columnId: { type: String, default: null }, // which column (by column.id)
  order: { type: Number, default: 0 }, // position within the column
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
