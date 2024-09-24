'use client'; // Ensures this is a client component to use hooks and localStorage

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

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

  // Helper to store user in both state and localStorage
  const setUser = (user: { id: number; full_name: string; email: string } | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  };

  // Load the user from localStorage when the app starts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
