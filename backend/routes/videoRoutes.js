import express from 'express';
import { createVideo, getSessionVideos, getVideoNotes, postVideoNotes, summarizeVideoHandler } from '../controllers/videoController.js';

const router = express.Router();

// Define the route with params for sessionId and youtubeUrl
router.post('/create', createVideo);
router.get('/:sessionId', getSessionVideos);
router.get('/get/summary' , summarizeVideoHandler);
router.post('/:videoId/notes', postVideoNotes);
router.get('/:videoId/notes', getVideoNotes);


export default router;
