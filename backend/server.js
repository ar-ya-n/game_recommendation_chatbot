/**
 * 🎮 Game Recommendation Chatbot - Express Server
 * Main entry point for the backend API.
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const logger = require("./utils/logger");
const errorHandler = require("./middleware/errorHandler");

// Import services
const supabaseService = require("./services/supabaseService");
const aiService = require("./services/aiService");

// Import routes
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/user");

const app = express();
const PORT = process.env.PORT || 5001;

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:3000"], credentials: true }));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  logger.debug(`${req.method} ${req.path}`);
  next();
});

// ============================================
// ROUTES
// ============================================
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "GameGuide AI Backend",
    gemini: geminiService.initGemini ? "check logs" : "not loaded",
    timestamp: new Date().toISOString(),
  });
});

app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
app.use("/user", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found: " + req.method + " " + req.path });
});

// Global error handler
app.use(errorHandler);

// ============================================
// STARTUP
// ============================================
async function start() {
  logger.info("🎮 Starting GameGuide AI Backend...");

  // Initialize services
  supabaseService.initSupabase();
  aiService.initAI();

  app.listen(PORT, () => {
    logger.success(`Server running on http://localhost:${PORT}`);
    logger.info("Endpoints:");
    logger.info("  POST   /auth/signup");
    logger.info("  POST   /auth/login");
    logger.info("  POST   /chat/message");
    logger.info("  GET    /chat/conversations");
    logger.info("  GET    /chat/conversation/:id");
    logger.info("  DELETE /chat/conversation/:id");
    logger.info("  GET    /user/profile");
    logger.info("  PUT    /user/profile");
    logger.info("  GET    /health");
  });
}

start().catch((err) => {
  logger.error("Failed to start server:", err);
  process.exit(1);
});
