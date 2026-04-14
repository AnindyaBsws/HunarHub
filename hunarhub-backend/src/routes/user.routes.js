//Import express and libraries
import express from 'express';


//Import controllers
import { testUser,registerUser,loginUser,getProfile,refreshTokenController,logoutUser } from '../controllers/user.controller.js';
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



//export route
export default router