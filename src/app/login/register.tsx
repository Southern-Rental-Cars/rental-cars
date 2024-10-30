'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/contexts/UserContext';
import Toast from '@/components/Toast';
import { FiMail, FiLock, FiUser, FiPhone, FiHome } from 'react-icons/fi';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [nextDisabled, setNextDisabled] = useState(true);

  // Form state
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

  const [billingInfo, setBillingInfo] = useState({
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: '',
  });

  const [licenseInfo, setLicenseInfo] = useState({
    licenseNumber: '',
    country: '',
    state: '',
    city: '',
    expirationDate: '',
    frontPhotoUrl: '',
    backPhotoUrl: '',
  });

  // Input validation for each step
  useEffect(() => {
    if (step === 1) {
      setNextDisabled(
        !personalInfo.email ||
        !personalInfo.password ||
        personalInfo.password !== personalInfo.confirmPassword
      );
    } else if (step === 2) {
      setNextDisabled(
        !personalInfo.fullName ||
        !personalInfo.dob ||
        !personalInfo.phone ||
        !personalInfo.address ||
        !personalInfo.zipCode ||
        !billingInfo.billingStreet ||
        !billingInfo.billingCity ||
        !billingInfo.billingState ||
        !billingInfo.billingZipCode ||
        !billingInfo.billingCountry
      );
    } else if (step === 3) {
      setNextDisabled(
        !licenseInfo.licenseNumber ||
        !licenseInfo.country ||
        !licenseInfo.state ||
        !licenseInfo.city ||
        !licenseInfo.expirationDate ||
        !licenseInfo.frontPhotoUrl ||
        !licenseInfo.backPhotoUrl
      );
    }
  }, [step, personalInfo, billingInfo, licenseInfo]);

  const handleNextStep = () => setStep((prev) => prev + 1);
  const handlePrevStep = () => setStep((prev) => (prev > 1 ? prev - 1 : prev));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, stateSetter: Function) => {
    const { id, value } = e.target;
    stateSetter((prevState: any) => ({ ...prevState, [id]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, id: 'frontPhotoUrl' | 'backPhotoUrl') => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setLicenseInfo((prev) => ({
        ...prev,
        [id]: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const payload = {
        email: personalInfo.email,
        password: personalInfo.password,
        full_name: personalInfo.fullName,
        date_of_birth: personalInfo.dob,
        phone: personalInfo.phone,
        street_address: personalInfo.address,
        zip_code: personalInfo.zipCode,
        license_number: licenseInfo.licenseNumber,
        license_country: licenseInfo.country,
        license_state: licenseInfo.state,
        license_city: licenseInfo.city,
        license_expiration: licenseInfo.expirationDate,
        country: licenseInfo.country,
        billing_street_address: billingInfo.billingStreet,
        billing_city: billingInfo.billingCity,
        billing_state: billingInfo.billingState,
        billing_postal_code: billingInfo.billingZipCode,
        billing_country: billingInfo.billingCountry,
      };

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        await loginUser(personalInfo.email, personalInfo.password);
      } else {
        const data = await response.json();
        setToastType('error');
        setToastMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch {
      setToastType('error');
      setToastMessage('An unexpected error occurred during registration.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(
          {
            id: data.user.id,
            full_name: data.user.full_name,
            email: data.user.email,
          },
          data.token
        );
        setToastType('success');
        setToastMessage('Registration successful! Redirecting...');
        router.push('/');
      } else {
        setToastType('error');
        setToastMessage('Login failed after registration. Please log in manually.');
      }
    } catch {
      setToastType('error');
      setToastMessage('An unexpected error occurred during login.');
    }
  };

  return (
    <div className="p-2">
      {error && (
        <div className="mb-4 text-red-600 text-center rounded-md p-2 bg-red-50">
          {error}
        </div>
      )}

      {/* Step 1: Account Credentials */}
      {step === 1 && (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="relative">
            <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="email" id="email" value={personalInfo.email} onChange={(e) => handleChange(e, setPersonalInfo)} 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
            placeholder="Email" />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="password" id="password" value={personalInfo.password} onChange={(e) => handleChange(e, setPersonalInfo)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
            placeholder="Password" />
          </div>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="password" id="confirmPassword" value={personalInfo.confirmPassword} onChange={(e) => handleChange(e, setPersonalInfo)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"
            placeholder="Confirm Password" />
          </div>
          <div className="flex justify-end">
            <button onClick={handleNextStep} disabled={nextDisabled} className={`btn-primary ${nextDisabled ? 'cursor-not-allowed' : ''}`}>Next</button>
          </div>
        </form>
      )}

      {/* Step 2: Personal & Billing Information */}
      {step === 2 && (
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <input type="text" id="fullName" value={personalInfo.fullName} onChange={(e) => handleChange(e, setPersonalInfo)} placeholder="Full Name" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="date" id="dob" value={personalInfo.dob} onChange={(e) => handleChange(e, setPersonalInfo)} placeholder="Date of Birth" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="phone" value={personalInfo.phone} onChange={(e) => handleChange(e, setPersonalInfo)} placeholder="Phone Number" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="address" value={personalInfo.address} onChange={(e) => handleChange(e, setPersonalInfo)} placeholder="Address" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="zipCode" value={personalInfo.zipCode} onChange={(e) => handleChange(e, setPersonalInfo)} placeholder="ZIP Code" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="billingStreet" value={billingInfo.billingStreet} onChange={(e) => handleChange(e, setBillingInfo)} placeholder="Billing Street Address" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="billingCity" value={billingInfo.billingCity} onChange={(e) => handleChange(e, setBillingInfo)} placeholder="Billing City" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="billingState" value={billingInfo.billingState} onChange={(e) => handleChange(e, setBillingInfo)} placeholder="Billing State" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="billingZipCode" value={billingInfo.billingZipCode} onChange={(e) => handleChange(e, setBillingInfo)} placeholder="Billing Postal Code" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="billingCountry" value={billingInfo.billingCountry} onChange={(e) => handleChange(e, setBillingInfo)} placeholder="Billing Country" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <div className="flex justify-between">
            <button onClick={handlePrevStep} className="btn-secondary">Previous</button>
            <button onClick={handleNextStep} disabled={nextDisabled} className={`btn-primary ${nextDisabled ? 'cursor-not-allowed' : ''}`}>Next</button>
          </div>
        </form>
      )}

      {/* Step 3: License Information */}
      {step === 3 && (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4 text-center">License Information</h2>
          <input type="text" id="licenseNumber" value={licenseInfo.licenseNumber} onChange={(e) => handleChange(e, setLicenseInfo)} placeholder="Driver's License Number" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="country" value={licenseInfo.country} onChange={(e) => handleChange(e, setLicenseInfo)} placeholder="Country of Issue" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="state" value={licenseInfo.state} onChange={(e) => handleChange(e, setLicenseInfo)} placeholder="State of Issue" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="text" id="city" value={licenseInfo.city} onChange={(e) => handleChange(e, setLicenseInfo)} placeholder="City of Issue" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <input type="date" id="expirationDate" value={licenseInfo.expirationDate} onChange={(e) => handleChange(e, setLicenseInfo)} placeholder="License Expiration Date" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-700"/>
          <label>Front of License</label>
          <input type="file" onChange={(e) => handleFileChange(e, 'frontPhotoUrl')} className="input"/>
          <label>Back of License</label>
          <input type="file" onChange={(e) => handleFileChange(e, 'backPhotoUrl')} className="input"/>
          <div className="flex justify-between">
            <button onClick={handlePrevStep} className="btn-secondary">Previous</button>
            <button type="submit" disabled={nextDisabled} className={`btn-primary ${nextDisabled ? 'bg-gray-400 cursor-not-allowed' : ''}`}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      )}
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
