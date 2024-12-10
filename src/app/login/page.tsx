'use client';

import React, { useState } from 'react';
import Login from './login';
import Register from './register';
import Logo from '@/images/transparent_southern_logo_5.png';
import Image from 'next/image';

export default function AuthPage() {
  // Set `isRegister` to `false` initially to show the login page by default
  const [isRegister, setIsRegister] = useState(false);

  // Function to toggle between Login and Register views
  const toggleAuthForm = () => setIsRegister(!isRegister);

  return (
    <div className="flex items-center justify-center px-4 pt-12 pb-12">
      <div className=" max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image 
            src={Logo}
            alt="Southern Rental Cars Logo"
            width={65} // Adjust the size as needed
            height={65} // Adjust the size as needed
            loading="lazy"
          />
        </div>
        {/* Welcome Message */}
        <h1 className="text-2xl text-center font-bold text-gray-800 mb-3">
            {isRegister ? 'Create an Account' : "Welcome Back"}
          </h1>

        {/* Conditionally Render Login or Register Component */}
        {isRegister ? <Register /> : <Login />}
        {/* Divider */}
        <div className="relative p-2">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>
        {/* Toggle Link */}
        <p className="mt-2 text-center text-gray-600">
          {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button onClick={toggleAuthForm} className="text-blue-600 hover:underline font-medium">
            {isRegister ? 'Log in' : 'Create an account'}
          </button>
        </p>
      </div>
    </div>
  );
}
