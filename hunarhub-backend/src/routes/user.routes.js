//Import express and libraries
import express from 'express';


//Import controllers
import { testUser,registerUser,loginUser,refreshTokenController,logoutUser } from '../controllers/user.controller.js';
import { getProfile, createProfile } from "../controllers/profile.controller.js";
import { getEntrepreneurs, getEntrepreneurById } from '../controllers/entrepreneur.controller.js';


//Import Middlewares
import authMiddleware from '../middlewares/auth.middleware.js';

//Create router
const router = express.Router();

//Create test route
router.get('/test-user', testUser);

//DB check routes
router.post('/refresh', refreshTokenController);




//Auth Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

//User Routes
//Create Profile route with authMiddleware
router.get('/profile', authMiddleware, getProfile);
router.post('/profile/create', authMiddleware, createProfile);
router.get('/entrepreneurs', getEntrepreneurs);
router.get('/entrepreneurs/:id', getEntrepreneurById);



//export route
export default router