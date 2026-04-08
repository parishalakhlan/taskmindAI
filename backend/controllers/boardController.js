const Board = require("../models/Board");
const Task = require("../models/taskModel"); // your Task model

// ------------------- Board CRUD -------------------

exports.createBoard = async (req, res) => {
  try {
    const { name, columns } = req.body;
    // Default columns if none provided
    const defaultColumns = [
      { id: "col_todo", title: "To Do", order: 0 },
      { id: "col_inprogress", title: "In Progress", order: 1 },
      { id: "col_done", title: "Done", order: 2 },
    ];
    const board = new Board({
      userId: req.user.id,
      name: name || "My Kanban Board",
      columns: columns || defaultColumns,
    });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllBoards = async (req, res) => {
  try {
    const boards = await Board.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      userId: req.user.id,
    });
    if (!board) return res.status(404).json({ error: "Board not found" });

    // Get all tasks for this board, sorted by columnId and order
    const tasks = await Task.find({
      boardId: board._id,
      userId: req.user.id,
    }).sort({ columnId: 1, order: 1 });

    res.json({ board, tasks });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const board = await Board.findOneAndUpdate(
      { _id: req.params.boardId, userId: req.user.id },
      { name, updatedAt: Date.now() },
      { new: true },
    );
    if (!board) return res.status(404).json({ error: "Board not found" });
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findOneAndDelete({
      _id: req.params.boardId,
      userId: req.user.id,
    });
    if (!board) return res.status(404).json({ error: "Board not found" });
    // Also delete all tasks belonging to this board
    await Task.deleteMany({ boardId: req.params.boardId, userId: req.user.id });
    res.json({ message: "Board deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ------------------- Task Reordering -------------------
exports.reorderTask = async (req, res) => {
  try {
    const { taskId, newOrder } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.id, boardId: req.params.boardId },
      { order: newOrder },
      { new: true },
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.moveTask = async (req, res) => {
  try {
    const { taskId, newColumnId, newOrder } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.user.id, boardId: req.params.boardId },
      { columnId: newColumnId, order: newOrder },
      { new: true },
    );
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ------------------- Column Management -------------------
exports.addColumn = async (req, res) => {
  try {
    const { title } = req.body;
    const board = await Board.findOne({
      _id: req.params.boardId,
      userId: req.user.id,
    });
    if (!board) return res.status(404).json({ error: "Board not found" });

    const newId = `col_${Date.now()}`;
    const newOrder = board.columns.length;
    board.columns.push({ id: newId, title, order: newOrder });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.reorderColumns = async (req, res) => {
  try {
    const { columnOrder } = req.body; // array of column ids in new order
    const board = await Board.findOne({
      _id: req.params.boardId,
      userId: req.user.id,
    });
    if (!board) return res.status(404).json({ error: "Board not found" });

    // Update order for each column
    columnOrder.forEach((colId, idx) => {
      const column = board.columns.find((c) => c.id === colId);
      if (column) column.order = idx;
    });
    board.columns.sort((a, b) => a.order - b.order);
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateColumn = async (req, res) => {
  try {
    const { title } = req.body;
    const board = await Board.findOne({
      _id: req.params.boardId,
      userId: req.user.id,
    });
    if (!board) return res.status(404).json({ error: "Board not found" });

    const column = board.columns.find((c) => c.id === req.params.columnId);
    if (!column) return res.status(404).json({ error: "Column not found" });
    column.title = title;
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteColumn = async (req, res) => {
  try {
    const board = await Board.findOne({
      _id: req.params.boardId,
      userId: req.user.id,
    });
    if (!board) return res.status(404).json({ error: "Board not found" });

    const columnIndex = board.columns.findIndex(
      (c) => c.id === req.params.columnId,
    );
    if (columnIndex === -1)
      return res.status(404).json({ error: "Column not found" });
    board.columns.splice(columnIndex, 1);

    // Reorder remaining columns
    board.columns.forEach((col, idx) => {
      col.order = idx;
    });
    await board.save();

    // Move tasks from deleted column to null (or archive)
    await Task.updateMany(
      {
        boardId: req.params.boardId,
        columnId: req.params.columnId,
        userId: req.user.id,
      },
      { columnId: null },
    );
    res.json(board);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
