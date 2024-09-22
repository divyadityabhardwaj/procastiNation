import supabase from '../config/supabase.js'; // Your Supabase instance
import cookieParser from 'cookie-parser';


const authenticateUser = async (req, res, next) => {
    try {
      const token = req.cookies.access_token;

    //   console.log(token)
  
      if (!token) {
        return res.status(401).json({ message: 'You need to login or sign up first.' });
      }
  
      // Verify the token with Supabase
      const { data: { user }, error } = await supabase.auth.getUser(token);
      


      if (error || !user) {
        // Handle expired token error by forcing re-login
        if (error.message.includes('expired')) {
          return res.status(401).json({ message: 'Session expired. Please login again.' });
        }
        return res.status(401).json({ message: 'Invalid token or user not authenticated.' });
      }
      // Attach user info to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: 'An error occurred during authentication.' });
    }
  };
  

export default authenticateUser;