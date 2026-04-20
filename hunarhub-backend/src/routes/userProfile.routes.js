import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile, // ✅ NEW IMPORT
} from "../controllers/userProfile.controller.js";

const router = express.Router();

// ---------------- USER PROFILE ROUTES ----------------

// Get basic user profile
router.get("/profile", authMiddleware, getUserProfile);

// Update user (only phone)
router.patch("/profile", authMiddleware, updateUserProfile);

// 🔥 DELETE USER PROFILE (FULL ACCOUNT DELETE)
router.delete("/profile", authMiddleware, deleteUserProfile);

export default router;