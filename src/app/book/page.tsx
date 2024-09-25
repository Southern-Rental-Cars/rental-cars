'use client'; // Mark this as a client-side component

import { useSearchParams } from 'next/navigation'; // Use for extracting query parameters
import { useEffect, useState } from 'react';
import BookingConfirmation from './components/BookingConfirmation'; // Import the confirmation component
import Toast from '../../components/Toast'; // Import the Toast component
import Extras from './components/Extras'; // Import the Extras component

const TAX_RATE = 0.0825; // 8.25% tax

const Book = () => {
  const searchParams = useSearchParams(); // Get search params from the URL
  const [isExtrasLoading, setIsExtrasLoading] = useState(true); // Track extras loading state
  const [isConfirmed, setIsConfirmed] = useState(false); // State to check if booking is confirmed
  const [toastMessage, setToastMessage] = useState<string | null>(null); // Toast message state
  const [toastType, setToastType] = useState<'success' | 'error'>('success'); // Toast type (success/error)
  const [extras, setExtras] = useState<any[]>([]); // State to store extras
  const [selectedExtras, setSelectedExtras] = useState<any[]>([]);
  const [baseTotalCost, setBaseTotalCost] = useState(0); // Store the base total cost

  // Extracting query parameters with fallback in case they are missing
  const carId = searchParams?.get('carId') || null;
  const carName = searchParams?.get('carName') || null;
  const startDate = searchParams?.get('startDate') || null;
  const endDate = searchParams?.get('endDate') || null;
  const totalCost = searchParams?.get('totalCost') || null;

  // Set base total cost from URL param when component loads
  useEffect(() => {
    if (totalCost) {
      setBaseTotalCost(parseFloat(totalCost));
    }
  }, [totalCost]);

  // Calculate the total cost with extras
  const calculateTotalWithExtras = () => {
    const extrasCost = selectedExtras.reduce((total, extra) => {
      return total + extra.price_amount * extra.quantity; // Calculate the cost for each extra
    }, 0);
    const baseCost = baseTotalCost; // Base cost without extras
    const totalWithExtras = baseCost + extrasCost;
    const taxAmount = totalWithExtras * TAX_RATE;
    return totalWithExtras + taxAmount; // Add tax to the total
  };

  // Fetch extras data
  const fetchExtras = async () => {
    try {
      const response = await fetch('/api/extras');
      if (response.ok) {
        const data = await response.json();
        setExtras(data); // Store extras in state
      } else {
        throw new Error('Failed to fetch extras');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsExtrasLoading(false); // Set extras loading to false when done
    }
  };

  // Check if all parameters are available before rendering
  useEffect(() => {
    if (carId && startDate && endDate && totalCost) {
      fetchExtras(); // Fetch extras when the component mounts
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
        total_price: calculateTotalWithExtras(), // Send total with extras and tax to the API
        extras: selectedExtras, // Send selected extras
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
        setToastMessage(data.error || 'An error occurred during booking. Please try again.');
      }
    } catch (error) {
      setToastType('error');
      setToastMessage('An unexpected error occurred. Please try again.');
    }
  };

  // Handle adding/removing extras
  const handleAddToCart = (extra: any, quantity: number) => {
    // If quantity is zero, remove it from selected extras
    if (quantity === 0) {
      setSelectedExtras((prevExtras) =>
        prevExtras.filter((item) => item.id !== extra.id)
      );
    } else {
      // If the extra is already in the selected extras, update its quantity
      setSelectedExtras((prevExtras) => {
        const existingExtra = prevExtras.find((item) => item.id === extra.id);
        if (existingExtra) {
          return prevExtras.map((item) =>
            item.id === extra.id ? { ...item, quantity } : item
          );
        } else {
          return [...prevExtras, { ...extra, quantity }];
        }
      });
    }
  };

  // Close the toast message
  const closeToast = () => {
    setToastMessage(null);
  };

  // If the booking is confirmed, render the BookingConfirmation component
  if (isConfirmed) {
    return (
      <BookingConfirmation
        carName={carName as string}
        carId={parseInt(carId as string)}
        startDate={startDate as string}
        endDate={endDate as string}
        totalCost={calculateTotalWithExtras()} // Pass total with extras and tax to the confirmation page
        selectedExtras={selectedExtras} // Pass selected extras to the confirmation page
      />
    );
  }

  return (
    <div className="container mx-auto p-5 max-w-4xl">

      {/* Trip Details */}
      <div className="bg-white p-5">
        <h1 className="text-2xl font-semibold mb-5">Checkout</h1>
        <h2 className="text-lg font-medium mb-2">Your Booking</h2>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-semibold">{carName}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
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

      {/* Extras Component */}
      {!isExtrasLoading ? (<Extras
          extras={extras}
          startDate={startDate as string}
          endDate={endDate as string}
          onAddToCart={handleAddToCart}
        />
      ) : (
        null
      )}

      {/* Price Breakdown */}
      <div className="bg-white p-5">
        <p className="text-md mt-2">Base Price: ${baseTotalCost.toFixed(2)}</p>
        <p className="text-md mt-2">
          Extras Price: ${selectedExtras.reduce((total, extra) => total + extra.price_amount * extra.quantity, 0).toFixed(2)}
        </p>
        <p className="text-md mt-2">Tax (8.25%): ${(calculateTotalWithExtras() - baseTotalCost).toFixed(2)}</p>
        <p className="text-xl font-semibold mt-2">Total: ${calculateTotalWithExtras().toFixed(2)}</p>
      </div>

      {/* Confirm button to finalize the booking */}
      <button
        onClick={handleConfirmBooking}
        className="w-fit mt-10 bg-blue-500 text-white py-3 p-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Confirm Booking
      </button>

      {/* Render Toast if message exists */}
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={closeToast} />}
    </div>
  );
};

export default Book;
