const ollama = require("../services/ollamaService");
const Task = require("../models/taskModel");

exports.getAISuggestions = async (req, res) => {
  try {
    // Get user's last 3 tasks as context
    const contextTasks = await Task.find({ user: req.user.id })
      .sort("-createdAt")
      .limit(3)
      .select("title");

    // Get AI suggestions
    const suggestions = await ollama.suggestTasks(
      contextTasks.map((t) => t.title)
    );

    res.json({
      status: "success",
      data: suggestions,
    });
  } catch (err) {
    res.status(503).json({
      // 503 Service Unavailable
      status: "error",
      message: err.message,
      suggestion: "Try again in 30 seconds",
    });
  }
};
