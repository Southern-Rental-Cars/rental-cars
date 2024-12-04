'use client';

import React, { useState } from 'react';
import { FiMail } from 'react-icons/fi';
import ReCAPTCHA from 'react-google-recaptcha';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setError('Please complete the CAPTCHA challenge.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, recaptchaToken }),
      });

      if (response.ok) {
        setMessage('A password reset link has been sent to your email.');
        setEmail('');
      } else {
        const { message } = await response.json();
        setError(message || 'Failed to send reset link. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center justify-center px-4 pt-12">
      <div className="bg-white rounded-lg max-w-md w-full p-6 border border-gray-200">
      
        {/* Welcome Message */}
        <h2 className="text-xl font-semibold text-center text-gray-800 mb-3">Forgot password?</h2>
        {message && (
          <div className="mb-4 text-green-600 text-center border border-green-200 rounded-md p-2 bg-green-50">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 text-red-600 text-center border border-red-200 rounded-md p-2 bg-red-50">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
              placeholder="janedoe@gmail.com"
            />
          </div>

          {/* reCAPTCHA */}
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(token) => setRecaptchaToken(token)}
            onExpired={() => setRecaptchaToken(null)}
          />

          <button
            type="submit"
            disabled={isSubmitting || !recaptchaToken}
            className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
          >
            {isSubmitting ? 'Submitting...' : 'Send Link'}
          </button>

          <p className="text-center text-gray-600">
            Remember?{' '}
            <a href="/login" className="text-blue-600 hover:underline"> Login </a>
          </p>
        </form>
      </div>
    </div>
  );
}
