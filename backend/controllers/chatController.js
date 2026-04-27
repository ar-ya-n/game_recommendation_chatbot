/**
 * 🎮 Chat Controller
 * Handles chat message processing, conversation CRUD.
 */

const aiService = require("../services/aiService");
const supabaseService = require("../services/supabaseService");
const conversationService = require("../services/conversationService");
const logger = require("../utils/logger");

// In-memory fallback when DB is not configured
const memoryStore = {
  conversations: {},
  messages: {},
};

/**
 * POST /chat/message
 */
async function sendMessage(req, res, next) {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    let convId = conversationId;
    let isNew = false;

    // Create or reuse conversation
    if (supabaseService.getClient()) {
      if (!convId) {
        const conv = await supabaseService.createConversation(userId, conversationService.generateTitle(message));
        convId = conv.id;
        isNew = true;
      }
      // Save user message
      await supabaseService.saveMessage(convId, "user", message);

      // Get context window
      const history = await conversationService.getContextWindow(convId);
      // Remove last message (the one we just saved) since we pass it separately
      const pastMessages = history.slice(0, -1);

      // Get user profile for context
      let profile = null;
      try {
        profile = await supabaseService.getOrCreateProfile(userId);
      } catch (e) {
        logger.debug("No profile found, proceeding without.");
      }

      // Generate AI response
      const aiResponse = await aiService.generateResponse(message, pastMessages, profile);

      // Save AI response
      await supabaseService.saveMessage(convId, "assistant", aiResponse);

      // Update conversation title if new
      if (isNew) {
        await supabaseService.updateConversationTitle(convId, conversationService.generateTitle(message));
      }

      return res.json({
        conversationId: convId,
        isNewConversation: isNew,
        message: { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() },
      });
    } else {
      // In-memory fallback
      if (!convId) {
        convId = "local-" + Date.now();
        memoryStore.conversations[convId] = { id: convId, title: conversationService.generateTitle(message), userId };
        memoryStore.messages[convId] = [];
        isNew = true;
      }
      if (!memoryStore.messages[convId]) memoryStore.messages[convId] = [];
      memoryStore.messages[convId].push({ role: "user", content: message });

      const history = memoryStore.messages[convId].slice(-10, -1);
      const aiResponse = await aiService.generateResponse(message, history, null);

      memoryStore.messages[convId].push({ role: "assistant", content: aiResponse });

      return res.json({
        conversationId: convId,
        isNewConversation: isNew,
        message: { role: "assistant", content: aiResponse, timestamp: new Date().toISOString() },
      });
    }
  } catch (error) {
    next(error);
  }
}

/**
 * GET /chat/conversations
 */
async function getConversations(req, res, next) {
  try {
    if (supabaseService.getClient()) {
      const conversations = await supabaseService.getConversationsByUser(req.user.id);
      return res.json({ conversations });
    }
    const convs = Object.values(memoryStore.conversations).filter((c) => c.userId === req.user.id);
    return res.json({ conversations: convs });
  } catch (error) {
    next(error);
  }
}

/**
 * GET /chat/conversation/:id
 */
async function getConversation(req, res, next) {
  try {
    const { id } = req.params;
    if (supabaseService.getClient()) {
      const conversation = await supabaseService.getConversationById(id);
      const messages = await supabaseService.getMessagesByConversation(id);
      return res.json({ conversation, messages });
    }
    return res.json({
      conversation: memoryStore.conversations[id] || null,
      messages: memoryStore.messages[id] || [],
    });
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /chat/conversation/:id
 */
async function deleteConversation(req, res, next) {
  try {
    const { id } = req.params;
    if (supabaseService.getClient()) {
      await supabaseService.deleteConversation(id);
    } else {
      delete memoryStore.conversations[id];
      delete memoryStore.messages[id];
    }
    return res.json({ success: true });
  } catch (error) {
    next(error);
  }
}

module.exports = { sendMessage, getConversations, getConversation, deleteConversation };
