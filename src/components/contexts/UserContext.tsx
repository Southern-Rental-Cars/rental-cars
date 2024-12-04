'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { User } from '@/types'; // Import the general User type

interface UserContextType {
  user: Partial<User> | null; // Allow saving only necessary fields
  setUser: (user: Partial<User> | null) => void;
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
  const [user, setUserState] = useState<Partial<User> | null>(null);

  const setUser = (user: Partial<User> | null) => {
    setUserState(user);
    if (user) {
      // Save only necessary fields in cookies
      const { id, email, is_billing_complete, is_license_complete, phone } = user;
      console.log(user);

      Cookies.set(
        'user',
        JSON.stringify({ id, email, is_billing_complete, is_license_complete, phone }),
        { expires: 7 }
      );
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
        Cookies.remove('user');
        setUser(null);
        window.location.href = '/login';
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
