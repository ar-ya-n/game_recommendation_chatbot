/**
 * 🎮 User Controller
 * Handles user profile and preferences.
 */

const supabaseService = require("../services/supabaseService");
const { DEFAULT_USER_PROFILE } = require("../utils/constants");

async function getProfile(req, res, next) {
  try {
    if (supabaseService.getClient()) {
      const profile = await supabaseService.getOrCreateProfile(req.user.id);
      return res.json({ profile });
    }
    return res.json({ profile: { user_id: req.user.id, ...DEFAULT_USER_PROFILE } });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const updates = {};
    const allowed = [
      "favorite_genres", "favorite_games", "preferred_platforms",
      "budget_range", "playtime_availability", "difficulty_preference", "multiplayer_interest",
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (supabaseService.getClient()) {
      const profile = await supabaseService.updateProfile(req.user.id, updates);
      return res.json({ profile });
    }
    return res.json({ profile: { user_id: req.user.id, ...DEFAULT_USER_PROFILE, ...updates } });
  } catch (error) {
    next(error);
  }
}

async function getRecommendationsHistory(req, res, next) {
  try {
    if (supabaseService.getClient()) {
      const conversations = await supabaseService.getConversationsByUser(req.user.id);
      return res.json({ history: conversations });
    }
    return res.json({ history: [] });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProfile, updateProfile, getRecommendationsHistory };
