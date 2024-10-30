'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Define the shape of the context data
interface UserContextType {
  user: {
    id: number;
    full_name: string;
    email: string;
  } | null;
  token: string | null; // Add token to context
  setUser: (user: { id: number; full_name: string; email: string } | null, token: string | null) => void;
}

// Create the context with a default value of undefined
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
  const [token, setTokenState] = useState<string | null>(null);

  // Helper to store user and token in both state and cookies
  const setUser = (user: { id: number; full_name: string; email: string } | null, token: string | null) => {
    console.log(user + " " + token);

    setUserState(user);
    setTokenState(token);
    if (user && token) {
      // Store the user and token in cookies
      Cookies.set('user', JSON.stringify(user), { expires: 7 }); // Cookie expires in 7 days
      Cookies.set('token', token, { expires: 7 }); // Store JWT token in cookie
    } else {
      // Remove the user and token from cookies if logged out
      Cookies.remove('user');
      Cookies.remove('token');
    }
  };

  // Load the user and token from cookies when the app starts
  useEffect(() => {

    const cookieUser = Cookies.get('user');
    const cookieToken = Cookies.get('token');
    if (cookieUser && cookieToken) {
      setUserState(JSON.parse(cookieUser));
      setTokenState(cookieToken);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, token, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
