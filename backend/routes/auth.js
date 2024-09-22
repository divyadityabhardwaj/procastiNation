import express from 'express';
import { signIn, signUp, forgotPassword, signOut, getUserDetails } from '../controllers/authController.js';
import cookieParser from 'cookie-parser';
import authenticateUser from '../middlewares/authmiddleware.js';


const router = express.Router();
router.use(cookieParser());

// Existing routes
router.post('/signin', signIn);
router.post('/signup', signUp);
router.post('/forgot-password', forgotPassword);

// New sign-out route
router.post('/signout', signOut);

router.get('/user',getUserDetails);


export default router;
