'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';

// Define the shape of the context data
interface UserContextType {
  user: { id: number; full_name: string; email: string } | null;
  setUser: (user: { id: number; full_name: string; email: string } | null ) => void;
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

  // Helper to store user and token in both state and cookies
  const setUser = (user: { id: number; full_name: string; email: string } | null) => {
    setUserState(user);

    if (user) {
      // Store the user and token in cookies
      Cookies.set('user', JSON.stringify(user), { expires: 7 });
    } else {
      // Remove the user and token from cookies if logged out
      Cookies.remove('user');
    }
  };

  // Load the user and token from cookies when the app starts
  useEffect(() => {
    const cookieUser = Cookies.get('user');
    if (cookieUser) {
      setUserState(JSON.parse(cookieUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};