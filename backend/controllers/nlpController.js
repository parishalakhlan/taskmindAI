// controllers/nlpController.js
const ollama = require("../services/ollamaService");
const Task = require("../models/taskModel");
const AppError = require("../utils/appError");

exports.parseTaskCommand = async (req, res, next) => {
  try {
    const { text } = req.body;

    // Step 1: Extract structured data from natural language
    const parsed = await ollama.generateJSON(`
      Convert this task description to JSON:
      "${text}"
      
      Use this schema:
      {
        "title": "string",
        "dueDate": "ISO date or null",
        "priority": "low|medium|high",
        "category": "string or null",
        "action": "create|update|delete"
      }
    `);

    // Step 2: Validate and process
    let result;
    switch (parsed.action) {
      case "create":
        result = await Task.create({
          ...parsed,
          user: req.user.id,
        });
        break;
      case "update":
        // Add logic to handle updates
        break;
      default:
        throw new AppError("Unsupported action", 400);
    }

    res.status(200).json({
      status: "success",
      data: {
        parsedData: parsed,
        task: result,
      },
    });
  } catch (err) {
    next(err);
  }
};
