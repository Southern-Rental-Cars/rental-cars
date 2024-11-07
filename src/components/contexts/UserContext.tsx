// app/components/contexts/UserContext.ts

'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';

interface UserContextType {
  user: { id: number; email: string } | null;
  setUser: (user: { id: number; email: string } | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<{ id: number; email: string } | null>(null);

  const setUser = (user: { id: number; email: string } | null) => {
    setUserState(user);
    if (user) {
      Cookies.set('user', JSON.stringify(user), { expires: 7 });
    } else {
      Cookies.remove('user');
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        // Clear client-side cookies and state
        Cookies.remove('user');
        setUser(null);

        // Redirect to the login page
        window.location.href = '/login'; // Immediate redirect
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    const cookieUser = Cookies.get('user');
    if (cookieUser) {
      setUserState(JSON.parse(cookieUser));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};
