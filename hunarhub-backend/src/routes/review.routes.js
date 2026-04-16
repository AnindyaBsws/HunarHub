import express from 'express';
import { createReview } from '../controllers/review.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createReview);

export default router;