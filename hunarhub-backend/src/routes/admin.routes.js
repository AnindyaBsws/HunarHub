import express from 'express';
import { updateVerificationStatus } from '../controllers/admin.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// For now: any logged-in user can act as admin (we'll refine later)
router.patch('/verify/:profileId', authMiddleware, updateVerificationStatus);

export default router;