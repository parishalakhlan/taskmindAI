const ollama = require("../services/ollamaService");
const Task = require("../models/taskModel");

exports.getTaskSuggestions = async (req, res) => {
  try {
    console.log("AI suggestions function hit!");
    console.log("Request body:", req.body);

    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        status: "error",
        message: "Task title is required for suggestions",
      });
    }

    // Get AI suggestions based on form input
    const suggestions = await ollama.suggestTasks([title]);

    res.json({
      status: "success",
      data: {
        suggestions: suggestions,
      },
    });
  } catch (err) {
    console.error("Error in getTaskSuggestions:", err);
    res.status(503).json({
      status: "error",
      message: err.message,
      suggestion: "Try again in 30 seconds",
    });
  }
};
exports.getTaskSuggestionsStream = async (req, res) => {
  try {
    console.log("AI streaming function hit!");
    const { title, description, priority } = req.body;

    if (!title) {
      return res.status(400).json({
        status: "error",
        message: "Task title is required for suggestions",
      });
    }

    // Set headers for SSE
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    });

    const prompt = `Based on this task: "${title}" , suggest 3 related sub-tasks as JSON array: [{"title": "..."}]`;

    // Use the existing streamGenerate method
    await ollama.streamGenerate(prompt, res);
  } catch (err) {
    console.error("Error in streaming suggestions:", err);
    res.write("event: error\ndata: AI request failed\n\n");
    res.end();
  }
};
