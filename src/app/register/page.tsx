'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/components/contexts/UserContext';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser(); // To automatically log in the user after registration

  // Step control and state
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null); // Error state for submission

  // Personal and contact information state
  const [personalInfo, setPersonalInfo] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    dob: '',
    phone: '',
    address: '',
    zipCode: '',
  });

  // License information state
  const [licenseInfo, setLicenseInfo] = useState({
    licenseNumber: '',
    country: '',
    state: '',
    expirationDate: '',
    frontPhotoUrl: '',
    backPhotoUrl: '',
  });

  const totalSteps = 2; // Total number of steps

  const handleNextStep = () => {
    if (personalInfo.password !== personalInfo.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setStep(step + 1);
    setError(null); // Clear any existing errors
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setPersonalInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleLicenseInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setLicenseInfo((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset the error state when submission starts
    setIsSubmitting(true); // Disable the submit button during the API call

    try {
      // Prepare the payload object with the specified variable names
      const payload = {
        email: personalInfo.email,
        password: personalInfo.password,
        full_name: personalInfo.fullName,
        date_of_birth: personalInfo.dob,
        phone: personalInfo.phone,
        street_address: personalInfo.address,
        zip_code: personalInfo.zipCode,

        // License information
        license_number: licenseInfo.licenseNumber,
        license_state: licenseInfo.state,
        license_expiration: licenseInfo.expirationDate,
        //license_front_img: licenseInfo.frontPhotoUrl,
        //license_back_img: licenseInfo.backPhotoUrl,

        country: licenseInfo.country,
      };

      console.log('Payload:', payload); // Log the payload for debugging purposes

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(payload), // Convert the payload to a JSON string
      });

      if (response.ok) {
        // Automatically log the user in after successful registration
        await loginUser(personalInfo.email, personalInfo.password);
      } else {
        const data = await response.json();
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const loginResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (loginResponse.ok) {
        const data = await loginResponse.json();
        // Automatically set the logged-in user
        setUser({
          id: data.user.id,
          full_name: data.user.full_name,
          email: data.user.email,
        });
        router.push('/'); // Redirect to the homepage after logging in
      } else {
        setError('Login failed after registration. Please log in manually.');
      }
    } catch (error) {
      setError('An unexpected error occurred during login.');
    }
  };

  // Dot navigation for step progress
  const renderDots = () => {
    return (
      <div className="flex justify-center mb-6">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full mx-1 ${
              step === index + 1 ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex justify-center mt-10">
      <div className="w-full max-w-md p-8">
        {/* Display error message if there is one */}
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

        {/* Render step dots */}
        {renderDots()}

        {step === 1 && (
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-2xl font-semibold mb-6 text-center">Personal & Contact Information</h2>
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={personalInfo.email}
                onChange={handlePersonalInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={personalInfo.password}
                onChange={handlePersonalInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Your password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={personalInfo.confirmPassword}
                onChange={handlePersonalInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Confirm your password"
              />
            </div>
            <div>
              <label htmlFor="fullName" className="block text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={personalInfo.fullName}
                onChange={handlePersonalInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label htmlFor="dob" className="block text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                id="dob"
                value={personalInfo.dob}
                onChange={handlePersonalInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="text"
                id="phone"
                value={personalInfo.phone}
                onChange={handlePersonalInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="555-123-4567"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                id="address"
                value={personalInfo.address}
                onChange={handlePersonalInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="123 Main St"
              />
            </div>
            <div>
              <label htmlFor="zipCode" className="block text-gray-700 mb-2">
                Zip Code
              </label>
              <input
                type="text"
                id="zipCode"
                value={personalInfo.zipCode}
                onChange={handlePersonalInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="90210"
              />
            </div>
            <div className="flex justify-between">
              <Link href="/login" className="text-blue-600 hover:underline">Already have an account? Login</Link>
              <button onClick={handleNextStep} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Next
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold mb-6 text-center">License Information</h2>
            <div>
              <label htmlFor="licenseNumber" className="block text-gray-700 mb-2">
                Driver's License Number
              </label>
              <input
                type="text"
                id="licenseNumber"
                value={licenseInfo.licenseNumber}
                onChange={handleLicenseInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="License Number"
              />
            </div>
            <div>
              <label htmlFor="country" className="block text-gray-700 mb-2">
                Country of Issue
              </label>
              <input
                type="text"
                id="country"
                value={licenseInfo.country}
                onChange={handleLicenseInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="Country"
              />
            </div>
            <div>
              <label htmlFor="state" className="block text-gray-700 mb-2">
                State of Issue
              </label>
              <input
                type="text"
                id="state"
                value={licenseInfo.state}
                onChange={handleLicenseInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                placeholder="State"
              />
            </div>
            <div>
              <label htmlFor="expirationDate" className="block text-gray-700 mb-2">
                License Expiration Date
              </label>
              <input
                type="date"
                id="expirationDate"
                value={licenseInfo.expirationDate}
                onChange={handleLicenseInfoChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Upload Front of License</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLicenseInfoChange({ target: { id: 'frontPhotoUrl', value: URL.createObjectURL(e.target.files[0]) } })}
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Upload Back of License</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleLicenseInfoChange({ target: { id: 'backPhotoUrl', value: URL.createObjectURL(e.target.files[0]) } })}
              />
            </div>
            <div className="flex justify-between">
              <button onClick={handlePrevStep} className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                Previous
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
