// Core modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Import custom modules

const errorHandler = require("./utils/errorHandler");
const authMiddleware = require("./middlewares/authMiddleware");

const aiRoutes = require("./routes/aiRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");

// Initialize Express app
const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(express.json());
// Middleware
const allowedOrigins = [
  "https://taskmind-ai-one.vercel.app", // deployed frontend
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control", // Add this
      "Pragma",
    ],
  }),
);
app.use(helmet());
app.use(morgan("dev"));

app.use(cookieParser());
app.use("/api/v1/nlp", require("./routes/nlpRoutes"));
// Health check route
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to taskMind AI Backend!",
    timestamp: new Date(),
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ai", aiRoutes);

app.use("/api/v1/tasks", authMiddleware, taskRoutes); // Protect tasks
app.use("/api/profile", profileRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Database Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    // Start server only after DB is ready
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ MongoDB connection error:", err);
    process.exit(1); // Exit app if DB connection fails
  });

// Global unhandled error handlers
process.on("uncaughtException", (err) => {
  console.log("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled Rejection:", err);
});

console.log("ENV CHECK:", {
  mongo: process.env.MONGODB_URI ? "exists" : "missing",
  jwt: process.env.JWT_SECRET ? "exists" : "missing",
  email: process.env.EMAIL_USER ? "exists" : "missing",
});
