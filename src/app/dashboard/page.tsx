'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/components/contexts/UserContext';
import { fetchCarById } from '@/utils/fetchCarById'; // Import the fetchCarById utility function

interface Booking {
  id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_cost: number;
  car_name?: string; // Optional field to store the fetched car name
}

interface User {
  id: number;
  full_name: string;
  email: string;
}

const Dashboard = () => {
  const { user } = useUser(); // Get the logged-in user's information from the context
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user information and bookings when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return; // If the user is not logged in, return

      try {
        setLoading(true);

        // Fetch user information from /users/:id
        const userResponse = await fetch(`/api/users/${user.id}`);
        if (!userResponse.ok) throw new Error('Failed to fetch user information');
        const userData = await userResponse.json();
        setUserInfo(userData.user);

        // Fetch bookings from /bookings?user_id
        const bookingsResponse = await fetch(`/api/bookings?user_id=${user.id}`);
        if (!bookingsResponse.ok) throw new Error('Failed to fetch bookings');
        const bookingsData: Booking[] = await bookingsResponse.json();

        // Fetch car names for each booking
        const bookingsWithCarNames = await Promise.all(
          bookingsData.map(async (booking) => {
            const car = await fetchCarById(booking.car_id); // Fetch the car details by ID
            return {
              ...booking,
              car_name: car ? `${car.make} ${car.model} ${car.year}` : 'Car not found',
            };
          })
        );

        setBookings(bookingsWithCarNames);
      } catch (error: any) {
        setError(error.message || 'An error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  if (!user) {
    return <p>Please log in to view your dashboard.</p>;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container mx-auto p-5 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-5">Dashboard</h1>

      <div className="bg-gray-100 p-5 rounded-lg mb-5">
        <h2 className="text-xl font-medium mb-3"> Profile Information</h2>
        <p><strong>Name:</strong> {userInfo?.full_name}</p>
        <p><strong>Email:</strong> {userInfo?.email}</p>
      </div>

      <div className="bg-gray-100 p-5 rounded-lg">
        <h2 className="text-xl font-medium mb-3">Booking History</h2>
        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking.id} className="mb-4 p-4 border rounded-lg bg-white shadow">
              <h3 className="text-lg font-medium">{booking.car_name}</h3>
              <p><strong>Start Date:</strong> {new Date(booking.start_date).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(booking.end_date).toLocaleDateString()}</p>
            </div>
          ))
        ) : (
          <p>You have no bookings yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
