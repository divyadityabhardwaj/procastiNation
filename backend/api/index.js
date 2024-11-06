import express from 'express';
import cors from 'cors';
import authRoutes from '../routes/auth.js';
import sessionRoutes from '../routes/sessionRoutes.js';
import videoRoutes from '../routes/videoRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL, // Your frontend URL
    credentials: true
}));

// Middleware for JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware for cookies
app.use(cookieParser());

// API routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/video', videoRoutes);

// Error handling middleware to catch any internal errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Export for Vercel (Vercel will manage the server, so no app.listen)
export default (req, res) => app(req, res);
