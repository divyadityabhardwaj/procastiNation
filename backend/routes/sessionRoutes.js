import express from 'express';
import { createSession, deleteSession, getSessionNotes, getUserSessions, saveSessionNotes, updateSession } from '../controllers/sessionController.js';
import authenticateUser from '../middlewares/authmiddleware.js';

const router = express.Router();


// Route to create a session
router.post('/create',authenticateUser, createSession);

// Route to delete a session
router.delete('/:sessionId', deleteSession);

// Route to update a session
router.put('/:sessionId', updateSession);

//all sessions made by user
router.get('/sessions', authenticateUser , getUserSessions);


router.post('/:sessionId/notes',  saveSessionNotes);


// Route to retrieve session notes
router.get('/:sessionId/notes', getSessionNotes);


export default router;
