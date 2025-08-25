const { TaskModel: Task } = require("../models/taskModel");
const AppError = require("../utils/appError");

const ollama = require("../services/ollamaService");

const handleNotFound = (task, res) => {
  if (!task) {
    return next(new AppError("No task found with that ID", 404));
  }
};

exports.createTask = async (req, res, next) => {
  try {
    // 1. Log the incoming request properly
    // Correct way

    // 2. Validate user
    if (!req.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    // 3. Process AI suggestions if requested
    let aiResponse = null;
    if (req.body.includeAISuggestions) {
      try {
        aiResponse = await ollama.suggestTasks([req.body.title]);
        console.log("AI suggestions generated", { suggestions: aiResponse });
      } catch (aiError) {
        console.log("AI suggestion failed", { error: aiError.message });
      }
    }

    // 4. Create the task
    const newTask = await Task.create({
      ...req.body,
      user: req.user._id,
      ...(aiResponse && { aiMeta: { suggestions: aiResponse } }),
    });

    // 5. Respond
    res.status(201).json({
      status: "success",
      data: {
        task: newTask,
        ...(aiResponse && { aiSuggestions: aiResponse }),
      },
    });
  } catch (err) {
    console.log("Task creation failed", {
      error: err.message,
      stack: err.stack,
    });

    next(err);
  }
};

// ... (keep other methods the same but update their logging)
exports.getAllTasks = async (req, res, next) => {
  try {
    // Ensure user ID exists
    if (!req.user?._id) {
      throw new AppError("User authentication required", 401);
    }

    const tasks = await Task.find({ user: req.user._id });

    res.status(200).json({
      status: "success",
      results: tasks.length,
      data: { tasks },
    });
  } catch (err) {
    next(err);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    handleNotFound(task, res);
    res.status(200).json({
      status: "success",
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    handleNotFound(task, res);
    res.status(200).json({
      status: "success",
      data: { task },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  console.log("deleteTask function backend");
  try {
    console.log("[DEBUG] Delete Task - Start");

    console.log(`Deleted task ID: ${req.params.id}`);
    const task = await Task.findByIdAndDelete(req.params.id);

    handleNotFound(task, res);

    console.log(`Deleted task ID: ${req.params.id}`);
    console.log("backend working fine");
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
exports.getTaskSuggestions = async (req, res, next) => {
  console.log("hitted ai f");
  try {
    // Get data from request body instead of database
    const { title } = req.body;

    if (!title) {
      return next(new AppError("Task title is required for suggestions", 400));
    }

    // Get AI suggestions based on form input
    const suggestions = await ollama.generate(`
      Based on this task: "${title}"
    
      
      Suggest 3 related sub-tasks or improvements as JSON array:
      [{ 
        "title": "...",
        "priority": "low|medium|high",
        "reason": "..."
      }]
    `);

    res.status(200).json({
      status: "success",
      data: {
        suggestions: suggestions,
      },
    });
  } catch (err) {
    next(err);
  }
};
exports.toggleTaskCompletion = async (req, res, next) => {
  console.log("toggle function called");
  try {
    // 1. Get the task
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        status: "fail",
        message: "Task not found",
      });
    }

    // 2. Toggle completion status
    task.completed = !task.completed;
    task.completedAt = task.completed ? new Date() : null;

    // 3. Save with validation
    await task.save({ validateBeforeSave: true });

    // 4. Respond with updated task
    res.status(200).json({
      status: "success",
      data: { task },
    });
    console.log(`Task ${task._id} completion toggled to ${task.completed}`);
  } catch (err) {
    console.log("Task completion toggle failed", {
      error: err.message,
      taskId: req.params.id,
    });
    // Send error response
    res.status(500).json({
      status: "error",
      message: "Failed to toggle task completion",
    });
  }
};
