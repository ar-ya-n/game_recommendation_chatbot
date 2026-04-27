/**
 * 🎮 Auth Routes
 * POST /auth/signup, /auth/login, /auth/logout
 */

const express = require("express");
const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");
const supabaseService = require("../services/supabaseService");
const logger = require("../utils/logger");

const router = express.Router();

// Simple password hashing (use bcrypt in production)
function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

// In-memory user store for when DB is not available
const localUsers = {};

/**
 * POST /auth/signup
 */
router.post("/signup", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: "Email, username, and password are required." });
    }

    const passwordHash = hashPassword(password);

    if (supabaseService.getClient()) {
      const existing = await supabaseService.getUserByEmail(email);
      if (existing) return res.status(409).json({ error: "Email already registered." });

      const user = await supabaseService.createUser(email, username, passwordHash);
      logger.success("User registered: " + email);
      return res.status(201).json({ user: { id: user.id, email: user.email, username: user.username } });
    } else {
      if (localUsers[email]) return res.status(409).json({ error: "Email already registered." });
      const id = uuidv4();
      localUsers[email] = { id, email, username, passwordHash };
      return res.status(201).json({ user: { id, email, username } });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/login
 */
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const passwordHash = hashPassword(password);

    if (supabaseService.getClient()) {
      const user = await supabaseService.getUserByEmail(email);
      if (!user || user.password_hash !== passwordHash) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
      return res.json({ user: { id: user.id, email: user.email, username: user.username } });
    } else {
      const user = localUsers[email];
      if (!user || user.passwordHash !== passwordHash) {
        return res.status(401).json({ error: "Invalid email or password." });
      }
      return res.json({ user: { id: user.id, email: user.email, username: user.username } });
    }
  } catch (error) {
    next(error);
  }
});

/**
 * POST /auth/logout
 */
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully." });
});

module.exports = router;
