/**
 * 🎮 Global Error Handler Middleware
 */

const logger = require("../utils/logger");

function errorHandler(err, req, res, next) {
  logger.error("Unhandled error:", err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}

module.exports = errorHandler;
