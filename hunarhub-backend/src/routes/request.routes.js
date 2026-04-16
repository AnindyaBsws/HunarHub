import express from 'express';
import { createRequest, getIncomingRequests, updateRequestStatus } from '../controllers/request.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createRequest);
router.get('/incoming', authMiddleware, getIncomingRequests);
router.patch('/:id', authMiddleware, updateRequestStatus);

export default router;