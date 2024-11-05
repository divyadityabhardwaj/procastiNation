'use client'; // Ensure this component is treated as a client component

import React, { useState } from 'react'; // Ensure useState is imported
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"; // New imports
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input"; // Import Input
import { Label } from "@/components/ui/label"; // Import Label
import Link from 'next/link'; // Import Link for navigation

const Modal = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState('login'); // State to toggle between login and signup
  const [email, setEmail] = useState(''); // State for email
  const [password, setPassword] = useState(''); // State for password
  const [error, setError] = useState(null); // State for error messages

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError(null); // Reset error when toggling modes
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Reset error before submission

    try {
      const response = await fetch(`http://localhost:3001/api/auth/${mode === 'login' ? 'signin' : 'signup'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ...(mode === 'signup' && { name }), // Include name only for signup
        }),
        credentials: 'include', // Include credentials (cookies) in the request
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      
      // Redirect to /sessions on successful login
      if (mode === 'login') {
        onClose(); // Close modal on successful login/signup
        return; // Prevent further execution
      }

      onClose(); // Close modal on successful login/signup
    } catch (error) {
      console.error('Error during authentication:', error);
      setError('Failed to authenticate. Please try again.'); // Set error message
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Log In' : 'Sign Up'}</DialogTitle>
          <DialogDescription>
            {mode === 'login' ? 'Welcome back! Please log in to your account.' : 'Create an account to get started.'}
          </DialogDescription>
        </DialogHeader>
        <Button
          variant="ghost"
          className="absolute right-4 top-4 rounded-sm opacity-70"
          onClick={onClose}>
          <span className="sr-only">Close</span>
        </Button>
        {error && <div className="text-red-500 mb-4">{error}</div>} {/* Display error message */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full">{mode === 'login' ? 'Log In' : 'Sign Up'}</Button>
          <p className="text-sm text-center">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <Button variant="link" onClick={toggleMode} className="p-0">
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </Button>
          </p>
        </form>
        {mode === 'login' && (
          <Link href="/sessions" className="text-blue-500 hover:underline">
            Go to Sessions
          </Link>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;