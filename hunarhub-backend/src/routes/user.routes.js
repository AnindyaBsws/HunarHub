//Import express and libraries
import express from 'express';


//Import controllers
import { testUser,registerUser } from '../controllers/user.controller.js';

//Create router
const router = express.Router();

//Create test route
router.get('/test-user', testUser);

//Create registerUser route
router.post('/register', registerUser);


//export route
export default router