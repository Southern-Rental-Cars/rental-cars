import React from 'react';
import { cookies } from 'next/headers';
import { fetchVehicleById } from '@/lib/db/db';
import { Booking, User } from '@/types';

// Fetch user by ID
const fetchUserById = async (userId: number): Promise<User> => {
  const baseUrl = process.env.API_BASE_URL;
  const userResponse = await fetch(`${baseUrl}/api/user/${userId}`);
  if (!userResponse.ok) {
    throw new Error(`Failed to fetch user information. Status: ${userResponse.status}`);
  }
  return userResponse.json();
};

// Fetch bookings with car details
const fetchUserBookings = async (userId: number): Promise<Booking[]> => {
  const baseUrl = process.env.API_BASE_URL;
  const bookingsResponse = await fetch(`${baseUrl}/api/booking?user_id=${userId}`);
  if (!bookingsResponse.ok) {
    throw new Error(`Failed to fetch bookings. Status: ${bookingsResponse.status}`);
  }

  const bookingsData = await bookingsResponse.json();
  return await Promise.all(
    bookingsData.map(async (booking: Booking) => {
      const car = await fetchVehicleById(booking.vehicle_id);
      return {
        ...booking,
        car_name: car ? `${car.make} ${car.model} ${car.year}` : 'Car not found',
      };
    })
  );
};

// Fetch user data and bookings concurrently
const fetchUserData = async (userId: number): Promise<{ user: User; bookings: Booking[] }> => {
  const [user, bookings] = await Promise.all([fetchUserById(userId), fetchUserBookings(userId)]);
  return { user, bookings };
};

// Main Dashboard component
const Dashboard = async () => {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user');
  if (!userCookie) return <p>Please log in to view your dashboard.</p>;

  let user: User;
  try {
    user = JSON.parse(userCookie.value);
    if (!user.id) throw new Error('User ID is missing in the cookie');
  } catch {
    return <p>Invalid user data. Please log in again.</p>;
  }

  try {
    const { user: userInfo, bookings } = await fetchUserData(user.id);
    return (
      <div className="container mx-auto p-5 max-w-4xl">
        <ProfileSection userInfo={userInfo} />
        <LicenseSection userInfo={userInfo} />
        <BookingHistory bookings={bookings} />
      </div>
    );
  } catch {
    return <p>Error loading dashboard. Please try again later.</p>;
  }
};

// Profile Section component
const ProfileSection = ({ userInfo }: { userInfo: User }) => (
  <div className="bg-white shadow-md p-4 rounded-lg mb-6">
    <h2 className="text-xl font-semibold mb-3">Profile Information</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-gray-800">
      <p><span className="font-medium">Name:</span> {userInfo.user.full_name || 'N/A'}</p>
      <p className="break-words"><span className="font-medium">Email:</span> {userInfo.user.email || 'N/A'}</p>
      <p><span className="font-medium">Phone:</span> {userInfo.user.phone || 'N/A'}</p>
      <p><span className="font-medium">Address:</span> {userInfo.user.street_address || 'N/A'}, {userInfo.user.zip_code || 'N/A'}</p>
    </div>
  </div>
);

// License Section component
const LicenseSection = ({ userInfo }: { userInfo: User }) => (
  <div className="bg-white shadow-md p-4 rounded-lg mb-6">
    <h2 className="text-xl font-semibold mb-3">License Information</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-gray-800">
      <p><span className="font-medium">Number:</span> {userInfo.user.license_number || 'N/A'}</p>
      <p><span className="font-medium">State:</span> {userInfo.user.license_state || 'N/A'}</p>
      <p><span className="font-medium">Expiration:</span> {userInfo.user.license_expiration ? new Date(userInfo.user.license_expiration).toLocaleDateString() : 'N/A'}</p>
    </div>
  </div>
);

// Booking History component
const BookingHistory = ({ bookings }: { bookings: Booking[] }) => (
  <div className="bg-white shadow-md p-6 rounded-lg">
    <h2 className="text-2xl font-semibold mb-4">Booking History</h2>
    {bookings.length > 0 ? (
      bookings.map((booking) => <BookingCard key={booking.id} booking={booking} />)
    ) : (
      <div className="flex items-center justify-center h-40 text-center bg-gray-100 rounded-lg">
        <p className="text-lg text-gray-600">No past bookings found.</p>
      </div>
    )}
  </div>
);

// Booking Card component
const BookingCard = ({ booking }: { booking: Booking }) => (
  <div className="p-4 mb-5 bg-gray-50 border rounded-lg">
    <h3 className="text-lg font-semibold mb-1">{ booking.vehicle_id}</h3>
    <p><span className="font-medium">Start Date:</span> {new Date(booking.start_date).toLocaleDateString()}</p>
    <p><span className="font-medium">End Date:</span> {new Date(booking.end_date).toLocaleDateString()}</p>
    <p><span className="font-medium">Status:</span> {capitalize(booking.status)}</p>
    <p><span className="font-medium">Total Paid:</span> ${booking.total_price}</p>
    {booking.bookingExtras.length > 0 && (
      <div className="mt-2">
        <h4 className="text-md font-semibold mb-2">Extras:</h4>
        <ul className="list-disc pl-5 text-sm text-gray-700">
          {booking.bookingExtras.map((extra) => (
            <li key={extra.id}>{extra.extra_id} x{extra.quantity}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// Helper function to capitalize status text
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default Dashboard;
