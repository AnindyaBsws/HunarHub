import express from 'express';
import { createService, getAllServices } from '../controllers/service.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createService);
router.get('/', getAllServices);

export default router;