/**
 * 🎮 User Routes
 */

const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, userController.getProfile);
router.put("/profile", authMiddleware, userController.updateProfile);
router.get("/recommendations-history", authMiddleware, userController.getRecommendationsHistory);

module.exports = router;
