import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import { createService, getAllServices, getMyServices, updateService, deleteService,getServicesByProfile } from '../controllers/service.controller.js';


const router = express.Router();

router.post('/create', authMiddleware, createService);
router.get('/', getAllServices);
router.get('/my', authMiddleware, getMyServices);
router.patch('/:id', authMiddleware, updateService);
router.delete('/:id', authMiddleware, deleteService);
router.get('/profile/:id', getServicesByProfile);

export default router;