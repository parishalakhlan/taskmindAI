const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const boardController = require("../controllers/boardController");

// All board routes require authentication
router.use(authMiddleware);

// Board CRUD
router.post("/", boardController.createBoard);
router.get("/", boardController.getAllBoards);
router.get("/:boardId", boardController.getBoard);
router.put("/:boardId", boardController.updateBoard);
router.delete("/:boardId", boardController.deleteBoard);

// Task ordering within board
router.put("/:boardId/tasks/reorder", boardController.reorderTask); // change order inside same column
router.put("/:boardId/tasks/move", boardController.moveTask); // move to another column

// Column management
router.post("/:boardId/columns", boardController.addColumn);
router.put("/:boardId/columns/reorder", boardController.reorderColumns);
router.put("/:boardId/columns/:columnId", boardController.updateColumn);
router.delete("/:boardId/columns/:columnId", boardController.deleteColumn);

module.exports = router;
