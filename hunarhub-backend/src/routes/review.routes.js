import express from 'express';
import { createReview, getServiceReviews } from '../controllers/review.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createReview);
router.get('/service/:serviceId', getServiceReviews);

export default router;