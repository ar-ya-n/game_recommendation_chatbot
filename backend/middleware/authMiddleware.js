/**
 * 🎮 Auth Middleware
 * Simple token-based auth using user ID passed in headers.
 * For production, replace with proper JWT or Supabase Auth.
 */

const supabaseService = require("../services/supabaseService");

async function authMiddleware(req, res, next) {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({ error: "Authentication required. Send x-user-id header." });
  }

  try {
    if (supabaseService.getClient()) {
      const user = await supabaseService.getUserById(userId);
      if (!user) {
        return res.status(401).json({ error: "User not found." });
      }
      req.user = user;
    } else {
      // DB not configured, use a mock user
      req.user = { id: userId, username: "Guest", email: "guest@local" };
    }
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed." });
  }
}

module.exports = authMiddleware;
