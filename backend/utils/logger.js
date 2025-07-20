const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

// Helper method for request logging
logger.logRequest = (req) => {
  logger.info("Incoming request", {
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    user: req.user?.id,
  });
};

module.exports = logger;
