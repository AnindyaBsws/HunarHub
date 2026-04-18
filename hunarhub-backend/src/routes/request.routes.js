import express from 'express';
import { createRequest, getIncomingRequests, updateRequestStatus, getMyRequests, deleteRequest, markRequestsSeen } from '../controllers/request.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createRequest);
router.get('/incoming', authMiddleware, getIncomingRequests);
router.patch('/:id', authMiddleware, updateRequestStatus);
router.get('/my', authMiddleware, getMyRequests);
router.delete('/:id', authMiddleware, deleteRequest);
router.patch('/seen', authMiddleware, markRequestsSeen);

export default router;