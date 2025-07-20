const express = require("express");
const taskController = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Protect all routes below with authMiddleware
router.use(authMiddleware); // ✅ This adds auth to all routes below this line

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(taskController.updateTask)
  .delete(taskController.deleteTask);

router.get("/:id/suggestions", taskController.getTaskSuggestions);

module.exports = router;
