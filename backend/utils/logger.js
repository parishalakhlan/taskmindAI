const { createLogger, format, transports } = require("winston");

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(), // always available
  ],
});

// Only add File transport in local/dev
if (process.env.NODE_ENV !== "production") {
  const fs = require("fs");
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs");
  }
  logger.add(new transports.File({ filename: "logs/app.log" }));
}

module.exports = logger;
