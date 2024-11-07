'use client';
import React, { useEffect, useState } from 'react';
import { Booking, User } from '@/types';

// Fetch user profile data
const fetchUserProfile = async (): Promise<User> => {
  const userResponse = await fetch(`/api/user`, {
    credentials: 'include',
  });
  if (!userResponse.ok) {
    throw new Error(`Failed to fetch user profile. Status: ${userResponse.status}`);
  }
  return userResponse.json();
};

// Fetch bookings for the user
const fetchUserBookings = async (): Promise<Booking[]> => {
  const bookingsResponse = await fetch(`/api/booking`, {
    credentials: 'include',
  });
  if (!bookingsResponse.ok) {
    throw new Error(`Failed to fetch bookings. Status: ${bookingsResponse.status}`);
  }
  return bookingsResponse.json();
};

// Fetch vehicle details by vehicle ID
const fetchVehicleById = async (vehicleId: number): Promise<{ make: string; model: string; year: number }> => {
  const vehicleResponse = await fetch(`/api/vehicle/${vehicleId}`, {
    credentials: 'include',
  });
  if (!vehicleResponse.ok) {
    throw new Error(`Failed to fetch vehicle details. Status: ${vehicleResponse.status}`);
  }
  return vehicleResponse.json();
};

// Main Dashboard component
const Dashboard = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [profile, userBookings] = await Promise.all([
          fetchUserProfile(),
          fetchUserBookings(),
        ]);
        setUserProfile(profile);
        setBookings(userBookings);
      } catch (error) {
        setError("Error loading dashboard data. Please try again later.");
      }
    };
    loadDashboardData();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-5 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {userProfile && <ProfileSection userInfo={userProfile} />}
      <h2 className="text-xl font-semibold mt-8 mb-4">Booking History</h2>
      <div className="space-y-4">
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))
        ) : (
          <p className="text-lg text-gray-600">No bookings found.</p>
        )}
      </div>
    </div>
  );
};

// Profile Section component with "Edit" button
const ProfileSection = ({ userInfo }: { userInfo: User }) => {
  const handleEditProfile = () => {
    // Placeholder for edit profile functionality
    alert("Edit profile functionality will be added here.");
  };

  return (
    <div className="bg-white p-6 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Account Details</h2>
        <button
          onClick={handleEditProfile}
          className="text-blue-600 hover:underline"
        >
          Edit Profile
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-gray-800">
        <p><span className="font-medium">Name:</span> {userInfo.full_name || 'N/A'}</p>
        <p><span className="font-medium">Email:</span> {userInfo.email || 'N/A'}</p>
        <p><span className="font-medium">Phone:</span> {userInfo.phone || 'N/A'}</p>
        <p><span className="font-medium">Address:</span> {userInfo.street_address || 'N/A'}, {userInfo.zip_code || 'N/A'}</p>
        <p><span className="font-medium">Country:</span> {userInfo.country || 'N/A'}</p>
        <p><span className="font-medium">Date of Birth:</span> {userInfo.date_of_birth ? new Date(userInfo.date_of_birth).toLocaleDateString() : 'N/A'}</p>
      </div>
      <div className="mt-6 border-t pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-gray-800">
          <p><span className="font-medium">License Number:</span> {userInfo.license_number || 'N/A'}</p>
          <p><span className="font-medium">State:</span> {userInfo.license_state || 'N/A'}</p>
          <p><span className="font-medium">City:</span> {userInfo.license_city || 'N/A'}</p>
          <p><span className="font-medium">Country:</span> {userInfo.license_country || 'N/A'}</p>
          <p><span className="font-medium">Expiration Date:</span> {userInfo.license_expiration ? new Date(userInfo.license_expiration).toLocaleDateString() : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

// Booking Card component
const BookingCard = ({ booking }: { booking: Booking }) => {
  const [vehicleName, setVehicleName] = useState<string>('Loading vehicle details...');

  useEffect(() => {
    const loadVehicleName = async () => {
      try {
        const vehicle = await fetchVehicleById(booking.vehicle_id);
        setVehicleName(`${vehicle.year} ${vehicle.make} ${vehicle.model}`);
      } catch {
        setVehicleName('Vehicle details unavailable');
      }
    };
    loadVehicleName();
  }, [booking.vehicle_id]);

  return (
    <div className="p-4 bg-white border rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-2">{vehicleName}</h2>
      <p><span className="font-medium">Start Date:</span> {new Date(booking.start_date).toLocaleDateString()}</p>
      <p><span className="font-medium">End Date:</span> {new Date(booking.end_date).toLocaleDateString()}</p>
      <p><span className="font-medium">Total Price:</span> ${booking.total_price} {booking.currency}</p>
      <p><span className="font-medium">Paid:</span> {booking.is_paid ? 'Yes' : 'No'}</p>
      {booking.paypal_order_id && (
        <p><span className="font-medium">Payment Provider:</span> {booking.payment_provider}</p>
      )}
    </div>
  );
};

export default Dashboard;
