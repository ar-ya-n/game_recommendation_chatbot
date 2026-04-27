/**
 * 🎮 Chat Routes
 */

const express = require("express");
const chatController = require("../controllers/chatController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/message", authMiddleware, chatController.sendMessage);
router.get("/conversations", authMiddleware, chatController.getConversations);
router.get("/conversation/:id", authMiddleware, chatController.getConversation);
router.delete("/conversation/:id", authMiddleware, chatController.deleteConversation);

module.exports = router;
