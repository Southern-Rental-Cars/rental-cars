import { cookies } from 'next/headers';
import { fetchCarById } from '@/lib/db/queries';

interface BookingExtras {
  id: number;
  extra_id: number;
  quantity: number;
  extras: {
    name: string;
    description: string;
    price_amount: number;
  };
}

interface Booking {
  id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  status: string;
  total_cost: number;
  car_name?: string;
  booking_extras: BookingExtras[];
}

interface User {
  id: number;
  full_name: string;
  email: string;
}

// Fetches user information and their bookings
const fetchUserData = async (userId: number): Promise<{ user: User; bookings: Booking[] }> => {
  const baseUrl = process.env.API_BASE_URL;

  // Fetch user information
  const userResponse = await fetch(`${baseUrl}/api/users/${userId}`);
  if (!userResponse.ok) {
    throw new Error('Failed to fetch user information');
  }
  const userData = await userResponse.json();

  // Fetch user bookings
  const bookingsResponse = await fetch(`${baseUrl}/api/bookings?user_id=${userId}`);
  if (!bookingsResponse.ok) {
    throw new Error('Failed to fetch bookings');
  }
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

  return { user: userData.user, bookings: bookingsWithCarNames };
};

// Main Dashboard component
const Dashboard = async () => {
  // Retrieve user from cookies
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user');

  if (!userCookie) {
    return <p>Please log in to view your dashboard.</p>;
  }

  const user = JSON.parse(userCookie.value) as User;

  try {
    // Fetch user and booking details
    const { user: userInfo, bookings } = await fetchUserData(user.id);

    return (
      <div className="container mx-auto p-5 max-w-4xl">
        <ProfileSection userInfo={userInfo} />
        <BookingHistory bookings={bookings} />
      </div>
    );
  } catch (error) {
    return <p>Error loading dashboard: {error.message}</p>;
  }
};

// Separate component for rendering user profile
const ProfileSection = ({ userInfo }: { userInfo: User }) => (
  <div className="bg-gray-100 p-5 rounded-lg mb-5">
    <h2 className="text-xl font-medium mb-3">Profile Information</h2>
    <p><strong>Name:</strong> {userInfo.full_name}</p>
    <p><strong>Email:</strong> {userInfo.email}</p>
  </div>
);

// Separate component for rendering booking history
const BookingHistory = ({ bookings }: { bookings: Booking[] }) => (
  <div className="bg-gray-100 p-5 rounded-lg">
    <h2 className="text-xl font-medium mb-3">Booking History</h2>
    {bookings.length > 0 ? (
      bookings.map((booking) => (
        <BookingCard key={booking.id} booking={booking} />
      ))
    ) : (
      <p>No bookings found for this user.</p>
    )}
  </div>
);

// Component for individual booking card
const BookingCard = ({ booking }: { booking: Booking }) => (
  <div className="mb-4 p-4 border rounded-lg bg-white shadow">
    <h3 className="text-lg font-medium mb-1">{booking.car_name}</h3>
    <p><strong>Start Date:</strong> {new Date(booking.start_date).toLocaleDateString()}</p>
    <p><strong>End Date:</strong> {new Date(booking.end_date).toLocaleDateString()}</p>
    <p><strong>Status:</strong> {capitalize(booking.status)}</p>
    <p><strong>Amount:</strong> ${booking.total_cost}</p>
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
);

// Helper function to capitalize the status text
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default Dashboard;
