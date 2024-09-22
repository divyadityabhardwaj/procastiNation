import express from 'express';
import { createVideo } from '../controllers/videoController.js';

const router = express.Router();

// Define the route with params for sessionId and youtubeUrl
router.post('/create/:sessionId/:youtubeUrl', createVideo);

export default router;
