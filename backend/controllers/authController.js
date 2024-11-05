// controllers/authController.js
import supabase from '../config/supabase.js';
import nodemailer from 'nodemailer';

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
    host: "live.smtp.mailtrap.io",
    port: 587,
    auth: {
        user: "api",
        pass: "" // Add your password here
    }
});

// Sign Up - Register a new user
export const signUp = async (req, res) => {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
    });

    if (error) {
        console.log(error);
        return res.status(400).json({ error: error.message });
    }

    // Check if session exists in the response
    if (data.session) {
        res.cookie('access_token', data.session.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000, // 1 hour
        });
    }

    // If sign-up is successful, return the user 
    res.status(201).json({ user: data.user });
};

// Sign-in with email and password controller
export const signIn = async (req, res) => {
    const { email, password } = req.body;

    // Call Supabase's signInWithPassword function
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    // Store access token in cookie
    res.cookie('access_token', data.session.access_token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600000, // 1 hour
    });

    // Return user data
    res.json({ user: data.user });
};

// Forgot Password - Send Reset Email
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    // Generate a reset password link (you might need to customize this logic)
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'http://localhost:3001/reset-password', // Update with your frontend URL
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    // Send the reset email using Nodemailer
    const mailOptions = {
        from: 'no-reply@example.com', // Replace with your sender email
        to: email,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Please click the following link to reset your password: ${data.url}`, // Assuming data.url contains the reset link
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error sending email:', err);
            return res.status(500).json({ error: 'Error sending reset email' });
        }
        console.log('Reset email sent:', info.response);
    });

    res.json({ message: 'Password reset email sent successfully.' });
};

// Sign out function
export const signOut = async (req, res) => {
    const { error } = await supabase.auth.signOut();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    // If sign-out is successful
    res.json({ message: 'Successfully signed out.' });
};

// Get user details function
export const getUserDetails = async (req, res) => {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ error: 'Please log in first' });
    }

    // Get user details from Supabase
    const { data: userData, error } = await supabase.auth.getUser(token);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json(userData);
};
