//Import express and libraries
import express from 'express';


//Import controllers
import { testUser,registerUser,loginUser } from '../controllers/user.controller.js';

//Create router
const router = express.Router();

//Create test route
router.get('/test-user', testUser);




//Create registerUser route
router.post('/register', registerUser);
//Create LoginUser route
router.post('/login', loginUser);


//export route
export default router