import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/userProfile.controller.js";

const router = express.Router();

// ---------------- USER PROFILE ROUTES ----------------

// Get basic user profile
router.get("/profile", authMiddleware, getUserProfile);

// Update user (only phone)
router.patch("/profile", authMiddleware, updateUserProfile);

export default router;