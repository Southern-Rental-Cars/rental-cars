'use client';

import React, { useEffect, useState } from 'react';
import { Booking, User } from '@/types';
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import { FaArrowRight } from 'react-icons/fa';
import { useUser } from '@/components/contexts/UserContext'; // Import the UserContext
import Image from 'next/image';

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
  const { user: contextUser, setUser: setContextUser } = useUser(); // Access UserContext
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'bookings' | 'license' | 'billing' | 'phone'>('bookings');
  const [isNavigating, setIsNavigating] = useState(false);

  const updateUserInfo = (updatedData: Partial<User>) => {
    if (user) {
      // Update local user state
      const updatedUser = { ...user, ...updatedData };
      setUser(updatedUser);
  
      // Update the context with the same data
      setContextUser({ ...contextUser, ...updatedData });
    }
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [profile, bookings] = await Promise.all([fetchUserProfile(), fetchBookings()]);
        setUser(profile);
        setBookings(bookings);
      } catch (error) {
        setError("Error loading dashboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);

  if (loading) return <Loader />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-5 max-w-4xl relative">
      {isNavigating && (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
        <Loader /> {/* Overlay spinner for the entire dashboard */}
        </div>
      )}

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
        <button
          onClick={() => setActiveTab('billing')}
          className={`p-4 ${activeTab === 'billing' ? 'border-b-2 border-blue-600 font-bold' : 'text-gray-600'}`}
        >
          Billing Address
        </button>
        <button
          onClick={() => setActiveTab('phone')}
          className={`p-4 ${activeTab === 'phone' ? 'border-b-2 border-blue-600 font-bold' : 'text-gray-600'}`}
        >
          Phone number
        </button>
      </div>

      {activeTab === 'bookings' && (
        <div className="grid gap-4">
          {bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                setIsNavigating={setIsNavigating}
              />
            ))
          ) : (
            <p className="text-lg text-gray-600">Nothing found.</p>
          )}
        </div>
      )}

      {activeTab === 'license' && user && (
        <LicenseSection userInfo={user} updateUserInfo={updateUserInfo} />
      )}
      {activeTab === 'billing' && user && (
        <BillingSection userInfo={user} updateUserInfo={updateUserInfo}/>
      )}
      {activeTab === 'phone' && user && (
        <PhoneSection userInfo={user} updateUserInfo={updateUserInfo} />
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
    license_expiration: '',
    license_date_of_birth: '',
    license_street_address: '',
    license_zip_code: '',
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
      setFormData((prev) => ({ ...prev, [type]: url }));
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Failed to upload image. Please try again.');
    }
  };
  

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // Ensure license_expiration and license_date_of_birth are converted back to Date
    const updatedFormData = {
      ...formData,
      license_expiration: formData.license_expiration ? formData.license_expiration : undefined,
      license_date_of_birth: formData.license_date_of_birth ? formData.license_date_of_birth : undefined,
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

      updateUserInfo({ ...updatedFormData, is_license_complete: true });
      setIsEditing(false);
      setErrorMessage(null); // Clear the error message after success
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
          <div>
            <div className="mb-4">
              <p className="font-medium">License Front:</p>
              {userInfo.license_front_img ? (
                <Image
                  src={userInfo.license_front_img}
                  alt="License Front"
                  width={160}
                  height={80} 
                  className="mt-2 border"
                />              
              ) : (
                'N/A'
              )}
            </div>
            <div className="mb-4">
              <p className="font-medium">License Back:</p>
              {userInfo.license_back_img ? (
                <Image 
                  src={userInfo.license_back_img} 
                  alt="License Back" 
                  width={160} 
                  height={80} 
                  className="mt-2 border" 
                />
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
        <form id="license-form" onSubmit={handleSave} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label>
            Number:
            <input
              type="text"
              name="license_number"
              value={formData.license_number}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label>
            Expiration:
            <input
              type="date"
              name="license_expiration"
              value={formData.license_expiration}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label>
            Date of birth:
            <input
              type="date"
              name="license_date_of_birth"
              value={formData.license_date_of_birth}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label>
            Street Address:
            <input
              type="text"
              name="license_street_address"
              value={formData.license_street_address}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label>
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
          <label>
            State (TX):
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
          <label>
            Zip Code:
            <input
              type="text"
              name="license_zip_code"
              value={formData.license_zip_code}
              maxLength={5}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label>
            Country (USA):
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
          <label>
            Front-side photo:
            <input
              type="file"
              onChange={(e) => handleFileUpload(e, 'license_front_img')}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label>
            Back-side photo:
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

// Phone Section Component
const PhoneSection = ({ userInfo, updateUserInfo }: { userInfo: User; updateUserInfo: (data: Partial<User>) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    phone: userInfo.phone || '',
  });  
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  const handleEditToggle = () => {
    setIsEditing(true);
    setErrorMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to update phone number. Status: ${response.status}`);
      }

      updateUserInfo({ ...formData, phone: formData.phone });
      setIsEditing(false);
      setErrorMessage(null); // Clear the error message after success

      alert('Phone number updated successfully.');
    } catch (error) {
      console.error('Failed to update phone number:', error);
      setErrorMessage('Failed to save phone number. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage(null);
    setFormData({
      phone: userInfo.phone || '',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}
  
      {!isEditing ? (
        <div>
          <div className="mb-4">
            <p className="font-medium">Phone:</p>
            <p>{userInfo.phone || 'N/A'}</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="text-white font-semibold rounded-lg p-2 bg-blue-600 hover:bg-blue-700">
            Update
          </button>
        </div>
      ) : (
        <form id="phone-form" onSubmit={handleSave} className="grid grid-cols-1 gap-4">
          <label>
            Phone Number:
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <div className="flex justify-end space-x-4">
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

// Billing Section Component
const BillingSection = ({ userInfo, updateUserInfo }: { userInfo: User; updateUserInfo: (data: Partial<User>) => void }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    billing_street_address: userInfo.billing_street_address || '',
    billing_city: userInfo.billing_city || '',
    billing_state: userInfo.billing_state || '',
    billing_zip_code: userInfo.billing_zip_code || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEditToggle = () => {
    setIsEditing(true);
    setErrorMessage(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Failed to update billing information. Status: ${response.status}`);
      }

      updateUserInfo({ ...formData, is_billing_complete: true });
      setIsEditing(false);
      setErrorMessage(null); // Clear the error message after success

      alert('Billing information updated successfully.');
    } catch (error) {
      console.error('Failed to update billing information:', error);
      setErrorMessage('Failed to save billing information. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setErrorMessage(null);
    setFormData({
      billing_street_address: userInfo.billing_street_address || '',
      billing_city: userInfo.billing_city || '',
      billing_state: userInfo.billing_state || '',
      billing_zip_code: userInfo.billing_zip_code || '',
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg mb-6 border border-gray-200">
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      {!isEditing ? (
        <div>
          <div className="mb-4">
            <p className="font-medium">Street Address:</p>
            <p>{userInfo.billing_street_address || 'N/A'}</p>
          </div>
          <div className="mb-4">
            <p className="font-medium">City:</p>
            <p>{userInfo.billing_city || 'N/A'}</p>
          </div>
          <div className="mb-4">
            <p className="font-medium">State:</p>
            <p>{userInfo.billing_state || 'N/A'}</p>
          </div>
          <div className="mb-4">
            <p className="font-medium">Zip Code:</p>
            <p>{userInfo.billing_zip_code || 'N/A'}</p>
          </div>
          <button onClick={handleEditToggle} className="text-white font-semibold rounded-lg p-2 bg-blue-600 hover:bg-blue-700">
            Update
          </button>
        </div>
      ) : (
        <form id="billing-form" onSubmit={handleSave} className="grid grid-cols-1 gap-4">
          <label>
            Street Address:
            <input
              type="text"
              name="billing_street_address"
              value={formData.billing_street_address}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="billing_city"
              value={formData.billing_city}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label>
            State:
            <input
              type="text"
              name="billing_state"
              value={formData.billing_state}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <label>
            Zip Code:
            <input
              type="text"
              name="billing_zip_code"
              value={formData.billing_zip_code}
              maxLength={5}
              onChange={handleInputChange}
              className="border rounded w-full mt-1 p-2"
              required
            />
          </label>
          <div className="flex justify-end space-x-4">
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

// BookingCard Component
const BookingCard = ({ booking, setIsNavigating }: { booking: Booking; setIsNavigating: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const router = useRouter();

  const handleClick = () => {
    setIsNavigating(true);
    router.push(`/book/${booking.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-4 bg-white border border-gray-200 rounded-lg cursor-pointer flex items-center justify-between transition hover:shadow-lg relative"
    >
      <div>
        <h1 className='font-bold font-lg'>{booking.vehicle.year} {booking.vehicle.make} {booking.vehicle.model}</h1>
        <p>Start Date: {new Date(booking.start_date).toLocaleDateString()}</p>
        <p>End Date: {new Date(booking.end_date).toLocaleDateString()}</p>
        <p>Total: ${booking.total_price}</p>
      </div>
      <FaArrowRight />
    </div>
  );
};

export default Dashboard;
