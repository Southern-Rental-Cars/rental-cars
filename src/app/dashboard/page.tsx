import { cookies } from 'next/headers';
import { fetchCarById } from '@/lib/db/queries';
import { Booking, User } from '@/types';

const fetchUserById = async (userId: number): Promise<User> => {
  const baseUrl = process.env.API_BASE_URL;

  const userResponse = await fetch(`${baseUrl}/api/users/${userId}`);

  if (!userResponse.ok) {
    const errorText = await userResponse.text();
    console.error(`Failed to fetch user information: ${errorText}`);
    throw new Error(`Failed to fetch user information. Status: ${userResponse.status}`);
  }

  const userData: User = await userResponse.json();
  return userData;
};

// Fetch bookings for a user and add car information
const fetchUserBookings = async (userId: number): Promise<Booking[]> => {
  const baseUrl = process.env.API_BASE_URL;
  const bookingsResponse = await fetch(`${baseUrl}/api/booking?user_id=${userId}`);

  if (!bookingsResponse.ok) {
    const errorText = await bookingsResponse.text();
    console.error(`Failed to fetch bookings: ${errorText}`);
    throw new Error(`Failed to fetch bookings. Status: ${bookingsResponse.status}`);
  }

  const bookingsData = await bookingsResponse.json();

  // Ensure bookingsData is an array
  if (!Array.isArray(bookingsData)) {
    console.error('Expected an array of bookings, but received:', bookingsData);
    return [];
  }

  // Fetch car names for each booking
  const bookingsWithCarNames = await Promise.all(
    bookingsData.map(async (booking: Booking) => {
      const car = await fetchCarById(booking.car_id);
      return {
        ...booking,
        car_name: car ? `${car.make} ${car.model} ${car.year}` : 'Car not found',
      };
    })
  );

  return bookingsWithCarNames;
};

// Fetch user data and bookings concurrently
const fetchUserData = async (userId: number): Promise<{ user: User; bookings: Booking[] }> => {
  try {
    const [user, bookings] = await Promise.all([fetchUserById(userId), fetchUserBookings(userId)]);
    return { user, bookings };
  } catch (error) {
    console.error(`Error fetching user or bookings: ${error.message}`);
    throw new Error('Error fetching user or booking data');
  }
};

// Main Dashboard component
const Dashboard = async () => {
  const cookieStore = cookies();
  const userCookie = cookieStore.get('user');

  if (!userCookie) {
    return <p>Please log in to view your dashboard.</p>;
  }

  let user: User;
  try {
    user = JSON.parse(userCookie.value);
    if (!user.id) {
      throw new Error('User ID is missing in the cookie');
    }
  } catch (error) {
    console.error(`Error parsing user cookie: ${error.message}`);
    return <p>Invalid user data. Please log in again.</p>;
  }

  try {
    const { user: userInfo, bookings } = await fetchUserData(user.id);
    return (
      <div className="container mx-auto p-5 max-w-4xl">
        <ProfileSection userInfo={userInfo} />
        <BookingHistory bookings={bookings} />
      </div>
    );
  } catch (error: any) {
    return <p>Error loading dashboard: {error.message}</p>;
  }
};

// Profile Section component
const ProfileSection = ({ userInfo }: { userInfo: User }) => {
  return (
    <div className="bg-gray-100 p-5 rounded-lg mb-5">
      <h2 className="text-xl font-medium mb-3">Profile Information</h2>
      <p><strong>Name:</strong> {userInfo.user.full_name || 'N/A'}</p>
      <p><strong>Email:</strong> {userInfo.user.email || 'N/A'}</p>
      <p><strong>Phone:</strong> {userInfo.user.phone || 'N/A'}</p>
      <p><strong>Address:</strong> {userInfo.user.street_address || 'N/A'}, {userInfo.zip_code || 'N/A'}</p>
      <p><strong>License Number:</strong> {userInfo.user.license_number || 'N/A'}</p>
      <p><strong>License State:</strong> {userInfo.user.license_state || 'N/A'}</p>
      <p><strong>License Expiration:</strong> {userInfo.user.license_expiration ? new Date(userInfo.user.license_expiration).toLocaleDateString() : 'N/A'}</p>
    </div>
  );
};

// Booking History component
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

// Individual Booking Card component
const BookingCard = ({ booking }: { booking: Booking }) => (
  <div className="mb-4 p-4 border rounded-lg bg-white shadow">
    <h3 className="text-lg font-medium mb-1">{booking.car_name}</h3>
    <p><strong>Start Date:</strong> {new Date(booking.start_date).toLocaleDateString()}</p>
    <p><strong>End Date:</strong> {new Date(booking.end_date).toLocaleDateString()}</p>
    <p><strong>Status:</strong> {capitalize(booking.status)}</p>
    <p><strong>Total Paid:</strong> ${booking.total_price}</p>
    {booking.bookingExtras.length > 0 && (
      <div className="mt-2">
        <h4 className="text-md font-semibold">Extras:</h4>
        <ul>
          {booking.bookingExtras.map((extra) => (
            <li key={extra.id}>
              {extra.name} - Quantity: {extra.quantity}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);

// Helper function to capitalize status text
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export default Dashboard;
