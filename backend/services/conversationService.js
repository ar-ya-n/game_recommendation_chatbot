/**
 * 🎮 Conversation Memory Service
 * Manages conversation context window and user preference extraction.
 */

const { CONTEXT_WINDOW_SIZE } = require("../utils/constants");
const supabaseService = require("./supabaseService");
const logger = require("../utils/logger");

/**
 * Get the last N messages for context window
 */
async function getContextWindow(conversationId) {
  try {
    const messages = await supabaseService.getMessagesByConversation(conversationId, CONTEXT_WINDOW_SIZE);
    return messages.map((m) => ({ role: m.role, content: m.content }));
  } catch (error) {
    logger.error("Failed to get context window:", error.message);
    return [];
  }
}

/**
 * Auto-generate conversation title from first user message
 */
function generateTitle(message) {
  const cleaned = message.replace(/[^\w\s]/g, "").trim();
  if (cleaned.length <= 40) return cleaned;
  return cleaned.substring(0, 40).trim() + "...";
}

module.exports = { getContextWindow, generateTitle };
