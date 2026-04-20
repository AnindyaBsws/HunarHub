import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  getEntrepreneurProfile,
  updateEntrepreneurProfile,
  createEntrepreneurProfile,
  addExperience,
  updateExperience,
  deleteExperience,
  deleteEntrepreneurProfile,
} from "../controllers/entrepreneurProfile.controller.js";

const router = express.Router();

// ---------------- ENTREPRENEUR PROFILE ROUTES ----------------

// Create profile (become entrepreneur)
router.post("/profile", authMiddleware, createEntrepreneurProfile);

// Get own entrepreneur profile
router.get("/profile", authMiddleware, getEntrepreneurProfile);

// Update entrepreneur profile
router.patch("/profile", authMiddleware, updateEntrepreneurProfile);

// ---------------- EXPERIENCE / SKILLS ROUTES ----------------

// Add skill
router.post("/experience", authMiddleware, addExperience);

// Update skill
router.patch("/experience/:id", authMiddleware, updateExperience);

// Delete skill
router.delete("/experience/:id", authMiddleware, deleteExperience);

//Delete profile
router.delete("/profile", authMiddleware, deleteEntrepreneurProfile);

export default router;