'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/components/contexts/UserContext';
import { fetchCarById } from '@/utils/fetchCarById'; // Import the fetchCarById utility function

interface Booking {
  id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  status: string;
  total_cost: number;
  car_name?: string;
  booking_extras: {
    id: number;
    extra_id: number;
    quantity: number;
    extras: {
      name: string;
      description: string;
      price_amount: number;
    };
  }[];
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
  const [filter, setFilter] = useState<string>('active'); // Default filter is 'active'

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

  // Filter bookings based on the selected status
  const filteredBookings = bookings.filter((b) => b.status === filter);

  // Handle filter change
  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter);
  };

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

        {/* Filter Buttons */}
        <div className="mb-4">
          <button
            className={`mr-2 px-4 py-2 rounded ${filter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('active')}
          >
            Active
          </button>
          <button
            className={`mr-2 px-4 py-2 rounded ${filter === 'canceled' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('canceled')}
          >
            Canceled
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handleFilterChange('completed')}
          >
            Completed
          </button>
        </div>

        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="mb-4 p-4 border rounded-lg bg-white shadow">
              <h3 className="text-lg font-medium mb-1">{booking.car_name}</h3>
              <p><strong>Start Date:</strong> {new Date(booking.start_date).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(booking.end_date).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</p>
              <p><strong>Amount:</strong> ${booking.total_price}</p> {/* Display total price */}
              {/* Display Extras */}
              {booking.booking_extras.length > 0 && (
                <div className="mt-2">
                  <h4 className="text-md font-semibold">Extras:</h4>
                  <ul>
                    {booking.booking_extras.map((extra) => (
                      <li key={extra.id}>
                        {extra.extras.name} - Quantity: {extra.quantity}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>No bookings found for the selected status.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
