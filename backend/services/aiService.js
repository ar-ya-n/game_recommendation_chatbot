/**
 * 🎮 AI Service (Groq)
 * Handles communication with Groq API (Llama-3) for game recommendations.
 */

const Groq = require("groq-sdk");
const { SYSTEM_PROMPT } = require("../utils/constants");
const logger = require("../utils/logger");

let groq = null;
const MODEL = "llama-3.3-70b-versatile";

/**
 * Initialize AI client
 */
function initAI() {
  const key = process.env.GROQ_API_KEY;
  if (!key || key === "your_groq_api_key_here") {
    logger.warn("Groq API key not configured. AI features will return mock responses.");
    return null;
  }

  try {
    groq = new Groq({ apiKey: key });
    logger.success("Groq API initialized (model: " + MODEL + ")");
    return groq;
  } catch (error) {
    logger.error("Failed to initialize Groq API:", error.message);
    return null;
  }
}

/**
 * Generate AI response based on user message, context, and profile
 */
async function generateResponse(userMessage, conversationHistory = [], userProfile = null) {
  if (!groq) {
    logger.debug("Generating mock response (Groq API not initialized)");
    return "🎮 *Mock AI Mode* 🎮\n\nSince no API key is configured, I can't generate real recommendations right now.\n\nBut if I could, I might suggest **The Witcher 3: Wild Hunt** for an immersive RPG experience, or **Hades** if you want fast-paced action!\n\nPlease add a Groq API key to your `.env` file to enable real AI responses.";
  }

  try {
    // 1. Build context profile string if user profile exists
    let profileContext = "";
    if (userProfile) {
      profileContext = `\n\nUSER PROFILE CONTEXT:\n`;
      if (userProfile.favorite_genres?.length) profileContext += `- Favorite Genres: ${userProfile.favorite_genres.join(', ')}\n`;
      if (userProfile.preferred_platforms?.length) profileContext += `- Platforms: ${userProfile.preferred_platforms.join(', ')}\n`;
      if (userProfile.budget_range) profileContext += `- Budget: ${userProfile.budget_range}\n`;
      if (userProfile.difficulty_preference) profileContext += `- Preferred Difficulty: ${userProfile.difficulty_preference}\n`;
      if (userProfile.playtime_availability) profileContext += `- Time Available: ${userProfile.playtime_availability}\n`;
      if (userProfile.multiplayer_interest) profileContext += `- Prefers Multiplayer: Yes\n`;
    }

    // 2. Format system prompt
    const fullSystemPrompt = SYSTEM_PROMPT + profileContext;

    // 3. Format history for Groq API
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content
    }));

    // 4. Construct messages array
    const messages = [
      { role: "system", content: fullSystemPrompt },
      ...formattedHistory,
      { role: "user", content: userMessage }
    ];

    // 5. Call API
    const response = await groq.chat.completions.create({
      messages,
      model: MODEL,
      temperature: 0.6,
      top_p: 0.8,
      max_tokens: 1000,
    });

    return response.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
  } catch (error) {
    logger.error("Failed to generate AI response:", error.message);
    throw new Error(`Failed to generate AI response: ${error.message}`);
  }
}

module.exports = {
  initAI,
  generateResponse
};
