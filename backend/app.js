import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js'; // Import your auth routes
import sessionRoutes from './routes/sessionRoutes.js'; // Import the session routes
import cookieParser from 'cookie-parser';

;

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());


// Use the session routes
app.use('/api/sessions', sessionRoutes);
app.use('/api/auth', authRoutes); 



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
