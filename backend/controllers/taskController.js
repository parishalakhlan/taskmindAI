const { TaskModel: Task } = require("../models/taskModel");
const AppError = require("../utils/appError");
const logger = require("../utils/logger");
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
    logRequest: (req) => {
      logger.info(`Request body: ${JSON.stringify(req.body)}`);
    };

    // 2. Validate user
    if (!req.user?.id) {
      throw new AppError("Authentication required", 401);
    }

    // 3. Process AI suggestions if requested
    let aiResponse = null;
    if (req.body.includeAISuggestions) {
      try {
        aiResponse = await ollama.suggestTasks([req.body.title]);
        logger.info("AI suggestions generated", { suggestions: aiResponse });
      } catch (aiError) {
        logger.error("AI suggestion failed", { error: aiError.message });
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
    logger.error("Task creation failed", {
      error: err.message,
      stack: err.stack,
    });
    next(err);
  }
};

// ... (keep other methods the same but update their logging)
exports.getAllTasks = async (req, res, next) => {
  console.log("GET /api/v1/tasks called");
  console.log("User:", req.user);
  console.log("User ID type:", typeof req.user._id);
  console.log("User ID value:", req.user._id);
  try {
    // Ensure user ID exists
    if (!req.user?._id) {
      throw new AppError("User authentication required", 401);
    }
    console.log("About to query tasks for user:", req.user._id);
    console.log("Task model exists:", !!Task);
    console.log("Task model type:", typeof Task);
    console.log("Task.find function:", typeof Task.find);
    console.log("Task model name:", Task.modelName);
    console.log("Task collection name:", Task.collection.name);
    const tasks = await Task.find({ user: req.user._id });
    console.log("All tasks count:", tasks.length);
    console.log("Tasks found:", tasks.length);
    console.log("Tasks:", tasks);

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
    console.log(`[DEBUG] Request Params ID: ${req.params.id}`);
    const task = await Task.findByIdAndDelete(req.params.id);

    handleNotFound(task, res);

    logger.log(`Deleted task ID: ${req.params.id}`);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    next(err);
  }
};
exports.getTaskSuggestions = async (req, res, next) => {
  try {
    // 1. Get the current task
    const task = await Task.findById(req.params.id);
    if (!task) {
      return next(new AppError("No task found with that ID", 404));
    }

    // 2. Get AI suggestions
    const suggestions = await ollama.generate(`
      Based on this task: "${task.title}"
      Description: "${task.description}"
      Priority: ${task.priority}
      
      Suggest 3 related sub-tasks or improvements as JSON array:
      [{
        "title": "...",
        "priority": "low|medium|high",
        "reason": "..."
      }]
    `);

    // 3. Format response
    res.status(200).json({
      status: "success",
      data: {
        originalTask: task,
        suggestions: suggestions,
      },
    });
  } catch (err) {
    next(err);
  }
};
