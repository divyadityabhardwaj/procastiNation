import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js'; // Import your auth routes
import sessionRoutes from './routes/sessionRoutes.js'; // Import the session routes
import videoRoutes from './routes/videoRoutes.js';
import cookieParser from 'cookie-parser';

;

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true
})); 
app.use(express.json());
app.use(cookieParser());


// Use the session routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/video' ,videoRoutes);



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
