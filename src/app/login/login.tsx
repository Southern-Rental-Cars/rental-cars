'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/contexts/UserContext';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { user } = await response.json();
        if (user) {
          // Update user state in the UserContext
          setUser({
            id: user.id,
            email: user.email,
          });

          // Clear form and redirect after successful login
          setEmail('');
          setPassword('');
          router.push('/');
        } else {
          setError('Unexpected response format.');
        }
      } else {
        const { message } = await response.json();
        setError(message || 'Login failed. Please try again.');
      }
    } catch (err) {
      console.log('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2">
      {error && (
        <div className="mb-4 text-red-600 text-center border border-red-200 rounded-md p-2 bg-red-50">
          {error}
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
            placeholder="Email"
          />
        </div>

        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
            placeholder="Password"
          />
        </div>

        {/* Main Login Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
        >
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
        <p className="text-center text-gray-600">
          <a
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot your password?
          </a>
        </p>

      </form>
      
    </div>
  );
}