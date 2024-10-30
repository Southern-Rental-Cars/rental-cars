'use client';

import React, { useState } from 'react';
import Login from './login';
import Register from './register';

export default function AuthPage() {
  // Set `isRegister` to `false` initially to show the login page by default
  const [isRegister, setIsRegister] = useState(false);

  // Function to toggle between Login and Register views
  const toggleAuthForm = () => setIsRegister(!isRegister);

  return (
    <div className="flex items-center justify-center px-4 pt-12">
      <div className="bg-white rounded-lg max-w-md w-full p-6 border border-gray-200">
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="text-sm font-semibold text-gray-500">
            {isRegister ? 'Create an Account' : 'Log in to Your Account'}
          </h3>
          <hr className="my-2" />
        </div>
      {/* Welcome Message */}
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">Welcome to Southern Rental Cars</h2>
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
            {isRegister ? 'Log in' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
}