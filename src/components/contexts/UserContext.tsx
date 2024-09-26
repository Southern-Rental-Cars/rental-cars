'use client'; // Ensures this is a client component to use hooks and cookies

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Define the shape of the context data
interface UserContextType {
  user: {
    id: number;
    full_name: string;
    email: string;
  } | null;
  setUser: (user: { id: number; full_name: string; email: string } | null) => void;
}

// Create the context with a default value of null
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// UserProvider component to wrap around the app
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<{ id: number; full_name: string; email: string } | null>(null);

  // Helper to store user in both state, cookies, and local storage
  const setUser = (user: { id: number; full_name: string; email: string } | null) => {
    setUserState(user);
    if (user) {
      // Store the user in cookies and local storage
      Cookies.set('user', JSON.stringify(user), { expires: 7 }); // Cookie expires in 7 days
      localStorage.setItem('user', JSON.stringify(user)); // Store in localStorage
    } else {
      // Remove the user from cookies and local storage
      Cookies.remove('user');
      localStorage.removeItem('user');
    }
  };

  // Load the user from local storage first, then cookies if necessary, when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem('user'); // Try loading from local storage
    if (storedUser) {
      setUserState(JSON.parse(storedUser)); // If found in local storage, set the user state
    } else {
      // If not found in local storage, load from cookies
      const cookieUser = Cookies.get('user');
      if (cookieUser) {
        setUserState(JSON.parse(cookieUser));
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
