const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema({
  id: { type: String, required: true }, // unique column identifier, e.g., "col_123"
  title: { type: String, required: true }, // "To Do", "In Progress", "Done"
  order: { type: Number, required: true }, // position of column on the board
});

const boardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true, default: "My Kanban Board" },
  columns: [columnSchema], // array of columns
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update the `updatedAt` field on save
boardSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Board", boardSchema);
