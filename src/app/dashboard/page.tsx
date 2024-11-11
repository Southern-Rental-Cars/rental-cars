'use client';

import React, { useEffect, useState } from 'react';
import { Booking, User } from '@/types';
import Loader from '@/components/Loader';

// Fetch user profile data
const fetchUserProfile = async (): Promise<User> => {
  const userResponse = await fetch(`/api/user`, { credentials: 'include' });
  if (!userResponse.ok) {
    throw new Error(`Failed to fetch user profile. Status: ${userResponse.status}`);
  }
  return userResponse.json();
};

// Fetch bookings for the user
const fetchBookings = async (): Promise<Booking[]> => {
  const bookingsResponse = await fetch(`/api/booking`, { credentials: 'include' });
  if (!bookingsResponse.ok) {
    throw new Error(`Failed to fetch bookings. Status: ${bookingsResponse.status}`);
  }
  return bookingsResponse.json();
};

// Main Dashboard component with tab navigation
const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'license'>('bookings');

  const updateUserInfo = (updatedData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updatedData });
    }
  };

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profile, bookings] = await Promise.all([fetchUserProfile(), fetchBookings()]);
        setUser(profile);
        setBookings(bookings);
      } catch (error) {
        setError("Error loading dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-5 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6 mt-3">Dashboard</h1>
      <div className="flex justify-around border-b mb-6">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`p-4 ${activeTab === 'bookings' ? 'border-b-2 border-blue-600 font-bold' : 'text-gray-600'}`}
        >
          Booking History
        </button>
        <button
          onClick={() => setActiveTab('license')}
          className={`p-4 ${activeTab === 'license' ? 'border-b-2 border-blue-600 font-bold' : 'text-gray-600'}`}
        >
          Driver's License
        </button>
      </div>

      {activeTab === 'bookings' && (
      <div>
        <div className="grid gap-4"> {/* Updated to use gap-4 for spacing between cards */}
          {bookings.length > 0 ? (
            bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
          ) : (
            <p className="text-lg text-gray-600">Nothing found.</p>
          )}
        </div>
      </div>
    )}

    {activeTab === 'license' && user && (
      <LicenseSection userInfo={user} updateUserInfo={updateUserInfo} />
    )}
    </div>
  );
};

const LicenseSection = ({ userInfo, updateUserInfo }: { userInfo: User; updateUserInfo: (data: Partial<User>) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    license_number: '',
    license_state: '',
    license_city:'',
    license_country: '',
    license_expiration: new Date(),
    date_of_birth: new Date(),
    street_address: '',
    zip_code: '',
    license_front_img: '',
    license_back_img: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEditToggle = () => {
    setIsEditing(true);
    setErrorMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'license_front_img' | 'license_back_img') => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    const imageSide = type === 'license_front_img' ? 'front' : 'back';
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB in bytes

    try {
      const uploadResponse = await fetch(`/api/user/license?filename=${encodeURIComponent(file.name)}&imageSide=${imageSide}`, {
        method: 'POST',
        body: file,
      });
  
      if (file.size > MAX_FILE_SIZE) {
        alert('File size should not exceed 5 MB');
        return;
      }

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload image');
      }
  
      const { url } = await uploadResponse.json();
      console.log(url);
      setFormData((prev) => ({ ...prev, [type]: url }));
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Failed to upload image. Please try again.');
    }
  };
  

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Convert dates to ISO-8601 format if they are present
    const updatedFormData = {
      ...formData,
      license_expiration: formData.license_expiration ? new Date(formData.license_expiration).toISOString() : null,
      date_of_birth: formData.date_of_birth ? new Date(formData.date_of_birth).toISOString() : null,
    };

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedFormData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to update user information. Status: ${response.status}`);
      }

      updateUserInfo(formData);
      setIsEditing(false);
      alert('User information updated successfully.');
    } catch (error) {
      console.error('Failed to update user information:', error);
      setErrorMessage('Failed to save user information. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage(null);
    setFormData({ ...userInfo });
  };

  return (
    <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
  
      {!isEditing ? (
        <div>
          <div className="flex gap-4 mb-4">
            <div>
              <p className="font-medium">License Front:</p>
              {userInfo.license_front_img ? (
                <img src={userInfo.license_front_img} alt="License Front" className="w-40 h-40 mt-2 border" />
              ) : (
                'N/A'
              )}
            </div>
            <div>
              <p className="font-medium">License Back:</p>
              {userInfo.license_back_img ? (
                <img src={userInfo.license_back_img} alt="License Back" className="w-40 h-40 mt-2 border" />
              ) : (
                'N/A'
              )}
            </div>
          </div>
          <button onClick={handleEditToggle} className="text-white font-semibold rounded-lg p-2 bg-blue-600 hover:bg-blue-700">
            Update
          </button>
        </div>
      ) : (
        <form id="license-form" onSubmit={handleSave} className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="p-4 w-full">
            License Number:
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label className="p-4 w-full">
            Expiration Date:
            <input
              type="date"
              name="license_expiration"
              value={formData.license_expiration}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label className="p-4 w-full">
            Date of Birth:
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label className="p-4 w-full">
            Street Address:
            <input
              type="text"
              name="street_address"
              value={formData.street_address}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label className="p-4 w-full">
            City:
            <input
              type="text"
              name="license_city"
              value={formData.license_city}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label className="p-4 w-full">
            State (2 characters):
            <input
              type="text"
              name="license_state"
              value={formData.license_state}
              maxLength={2}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label className="p-4 w-full">
            Zip Code:
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label className="p-4 w-full">
            Country (3 characters):
            <input
              type="text"
              name="license_country"
              value={formData.license_country}
              maxLength={3}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label className="p-4 w-full">
            License Front Image:
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, 'license_front_img')}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label className="p-4 w-full">
            License Back Image:
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, 'license_back_img')}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 p-4">
            <button type="submit" className="p-2 text-white font-semibold rounded-lg bg-blue-600 hover:bg-blue-700" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button onClick={handleCancel} type="button" className="text-gray-600 hover:underline">
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );  
};

import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';

const BookingCard = ({ booking }: { booking: Booking }) => {
  return (
    <Link href={`/book/${booking.id}`}>
      <div className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer transition hover:shadow-lg hover:border-blue-600 flex items-center justify-between">
        <div className="flex flex-col space-y-1 text-sm text-gray-700">
          <div>
            <span className="font-medium">Start Date:</span> {new Date(booking.start_date).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">End Date:</span> {new Date(booking.end_date).toLocaleDateString()}
          </div>
          <div>
            <span className="font-medium">Total:</span> ${booking.total_price} {booking.currency}
          </div>
        </div>
        <button className="ml-4 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 flex items-center">
          View Details <FaArrowRight className="ml-2" />
        </button>
      </div>
    </Link>
  );
};




export default Dashboard;
