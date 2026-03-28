const express = require("express");
const aiController = require("../controllers/aiController");
const rateLimit = require("express-rate-limit");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
console.log("AI routes loaded");

// Limit to 10 requests per hour
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: "Too many AI requests, please try again later",
});
router.use(express.json());
router.use(authMiddleware);
router.use(aiLimiter);

router.post("/suggest", aiController.getTaskSuggestions); // ✅ POST

module.exports = router;
