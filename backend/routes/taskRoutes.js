const express = require("express");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
console.log("Task routes loaded");
// Protect all routes below with authMiddleware
router.use(authMiddleware); // ✅ This adds auth to all routes below this line
console.log("AI routes loaded");
router.post(
  "/suggest",
  (req, res, next) => {
    console.log("AI suggest route hit!");
    next();
  },
  taskController.getTaskSuggestions,
);
router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

module.exports = router;

router.patch("/:id/toggle-completion", taskController.toggleTaskCompletion);
