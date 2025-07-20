// routes/nlpRoutes.js
const express = require("express");
const nlpController = require("../controllers/nlpController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

router.post("/parse", nlpController.parseTaskCommand);

module.exports = router;
