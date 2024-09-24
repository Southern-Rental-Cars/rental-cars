'use client'; // Mark this as a client-side component

import { useSearchParams } from 'next/navigation'; // Use for extracting query parameters
import { useEffect, useState } from 'react';
import BookingConfirmation from './components/BookingConfirmation'; // Import the confirmation component
import Toast from './components/Toast'; // Import the Toast component

const Book = () => {
  const searchParams = useSearchParams(); // Get search params from the URL
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmed, setIsConfirmed] = useState(false); // State to check if booking is confirmed
  const [toastMessage, setToastMessage] = useState<string | null>(null); // Toast message state
  const [toastType, setToastType] = useState<'success' | 'error'>('success'); // Toast type (success/error)
  const [extras] = useState([{ extra_id: 2, quantity: 1 }]); // Example extras, you can adjust this dynamically

  // Extracting query parameters with fallback in case they are missing
  const carId = searchParams?.get('carId') || null;
  const carName = searchParams?.get('carName') || null;
  const startDate = searchParams?.get('startDate') || null;
  const endDate = searchParams?.get('endDate') || null;
  const totalCost = searchParams?.get('totalCost') || null;

  // Check if all parameters are available before rendering
  useEffect(() => {
    if (carId && startDate && endDate && totalCost) {
      setIsLoading(false); // When all params are available, stop loading
    }
  }, [carId, startDate, endDate, totalCost]);

  // Handle the booking confirmation process
  const handleConfirmBooking = async () => {
    try {
      // Retrieve user information from localStorage
      const storedUser = localStorage.getItem('user');
      let userId = null;
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        userId = parsedUser.id; // Extract user ID from localStorage
      }

      // If user ID is missing, show an error toast
      if (!userId) {
        setToastType('error');
        setToastMessage('User is not logged in!');
        return;
      }

      // Prepare the payload for the API request
      const payload = {
        car_id: parseInt(carId as string), // Convert carId to number
        user_id: userId,
        start_date: new Date(startDate as string).toISOString(),
        end_date: new Date(endDate as string).toISOString(),
        extras: extras, // Assuming extras are dynamically added/managed
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), // Send the payload in the correct format
      });

      if (response.ok) {
        setIsConfirmed(true); // Set confirmed state to true to render confirmation
        setToastType('success');
        setToastMessage('Booking confirmed successfully!');
      } else {
        const data = await response.json();
        setToastType('error');
        setToastMessage(data.message || 'An error occurred during booking. Please try again.');
      }
    } catch (error) {
      setToastType('error');
      setToastMessage('An unexpected error occurred. Please try again.');
    }
  };

  // Close the toast message
  const closeToast = () => {
    setToastMessage(null);
  };

  // Conditional rendering if loading
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // If the booking is confirmed, render the BookingConfirmation component
  if (isConfirmed) {
    return (
      <BookingConfirmation
        carName={carName as string}
        carId={parseInt(carId as string)}
        startDate={startDate as string}
        endDate={endDate as string}
        totalCost={parseFloat(totalCost as string)}
      />
    );
  }

  return (
    <div className="container mx-auto p-5 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-5">Confirm and Pay</h1>

      {/* Trip Details */}
      <div className="bg-gray-100 p-4 rounded-lg mb-5">
        <h2 className="text-lg font-medium mb-2">Your Booking</h2>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-semibold">{carName}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-gray-700">Start Date:</p>
            <p className="font-semibold">{new Date(startDate as string).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-gray-700">End Date:</p>
            <p className="font-semibold">{new Date(endDate as string).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="bg-gray-100 p-4 rounded-lg mb-5">
        <h2 className="text-lg font-medium mb-2">Price Details</h2>
        <p className="text-lg font-semibold mt-4">Total Cost: ${totalCost}</p>
      </div>

      {/* Confirm button to finalize the booking */}
      <button
        onClick={handleConfirmBooking}
        className="w-full bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600 transition"
      >
        Confirm and Pay
      </button>

      {/* Render Toast if message exists */}
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={closeToast} />}
    </div>
  );
};

export default Book;
