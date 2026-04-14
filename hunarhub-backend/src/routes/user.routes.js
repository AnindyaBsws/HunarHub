//Import controller and express
import { testUser } from '../controllers/user.controller.js';
import express from 'express';


//Create router
const router = express.Router();

//create test route
router.get('/test-user', testUser);


//export route
export default router