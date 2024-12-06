

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock } from 'react-icons/fi';
import { useUser } from '@/components/contexts/UserContext';
import ReCAPTCHA from 'react-google-recaptcha';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState(new Array(6).fill(''));
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isFormValid = formData.email && formData.password && formData.password === formData.confirmPassword;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d$/.test(value) && value !== '') return; // Allow only digits
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value !== '' && index < 5) {
      document.getElementById(`code-input-${index + 1}`)?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!captchaToken) {
      setError('Please complete the CAPTCHA verification.');
      setIsSubmitting(false);
      return;
    }

    try {
      const { email, password } = formData;
      const payload = { email, password };
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setShowVerificationModal(true);
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Register error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyCode = async () => {
    try {
      const code = verificationCode.join('');
      const payload = { email: formData.email, password: formData.password, code };

      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        // Automatically log in user
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, password: formData.password, captchaToken: captchaToken }),
        });

        if (loginResponse.ok) {
          const { user } = await loginResponse.json();
          if (user) {
            setUser({
              id: user.id,
              email: user.email,
            });
            setShowVerificationModal(false);
            router.push('/'); // Redirect to home page after login
          }
        } else {
          const loginData = await loginResponse.json();
          setError(loginData.message || 'Auto-login failed. Please log in manually.');
        }
      } else {
        const data = await response.json();
        setVerificationError(data.message || 'Invalid verification code. Please try again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError('An unexpected error occurred. Please try again.');
    }
  };

  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };

  return (
    <div className="p-2">
      {error && <div className="mb-4 text-red-600 text-center border border-red-200 rounded-md p-2 bg-red-50">{error}</div>}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="relative">
          <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
          />
        </div>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            id="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
          />
        </div>
        <div className="relative">
          <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="password"
            id="confirmPassword"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
          />
        </div>
        
        {/* CAPTCHA */}
        <div className="flex justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!} // Your public reCAPTCHA site key
            onChange={handleCaptchaChange}
            onExpired={() => setCaptchaToken(null)} // Reset token on expiration
          />
        </div>

        <button
          type="submit"
          disabled={!isFormValid || !captchaToken|| isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </form>

      {showVerificationModal && (
        <VerificationModal
          verificationCode={verificationCode}
          setVerificationCode={handleCodeChange}
          onClose={() => setShowVerificationModal(false)}
          onVerify={verifyCode}
          errorMessage={verificationError || ''}
        />
      )}
    </div>
  );
}

interface VerificationModalProps {
  verificationCode: string[];
  setVerificationCode: (idx: number, value: string) => void;
  onClose: () => void;
  onVerify: () => void;
  errorMessage?: string;
}

function VerificationModal({
  verificationCode,
  setVerificationCode,
  onClose,
  onVerify,
  errorMessage
}: VerificationModalProps) {
  const inputRefs = Array.from({ length: verificationCode.length }, () =>
    React.createRef<HTMLInputElement>()
  );

  const handleInputChange = (index: number, value: string) => {
    if (!/^\d$/.test(value) && value !== '') return; // Allow only digits

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(index, value);

    if (value !== '' && index < inputRefs.length - 1) {
      inputRefs[index + 1].current?.focus(); // Move to the next input
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs[index - 1].current?.focus(); // Move to the previous input on Backspace
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-center shadow-lg">
        <h2 className="text-xl font-semibold mb-2">Verify Your Email</h2>
        <p className="mb-4 text-gray-600">We’ve sent a code to your email. Enter it below:</p>

        <div className="flex justify-center space-x-2 mb-4">
          {verificationCode.map((digit, idx) => (
            <input
              key={idx}
              ref={inputRefs[idx]}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(idx, e.target.value)}
              onKeyDown={(e) => handleKeyDown(idx, e)}
              className="w-12 h-12 border border-gray-300 rounded text-center text-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ boxShadow: errorMessage ? '0 0 0 2px red' : '' }}
            />
          ))}
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
        )}

        <button
          onClick={onVerify}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Verify
        </button>

        <button
          onClick={onClose}
          className="mt-4 text-sm text-gray-500 underline"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
