import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  getEntrepreneurProfile,
  updateEntrepreneurProfile,
  createEntrepreneurProfile,
} from "../controllers/entrepreneurProfile.controller.js";

const router = express.Router();

// ---------------- ENTREPRENEUR PROFILE ROUTES ----------------

// Create profile (become entrepreneur)
router.post("/profile", authMiddleware, createEntrepreneurProfile);

// Get own entrepreneur profile
router.get("/profile", authMiddleware, getEntrepreneurProfile);

// Update entrepreneur profile
router.patch("/profile", authMiddleware, updateEntrepreneurProfile);

export default router;