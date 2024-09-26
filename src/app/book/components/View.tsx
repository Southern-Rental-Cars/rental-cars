'use client';
import React, { useState, useEffect } from 'react';
import Toast from '../../../components/Toast'; // Import Toast component for notifications
import Extras from './Extras'; // Import Extras component to display available extras

// Define the type for the props
interface BookViewProps {
  carId: string;
  startDate: string;
  endDate: string;
  totalCost: string;
  extras: any[]; // Replace 'any' with the proper type for extras if needed
  availability: any; // Replace 'any' with the actual type for availability
}

export default function BookView({
  carId,
  startDate,
  endDate,
  totalCost,
  extras,
  availability,
}: BookViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null); // State for toast notifications
  const [toastType, setToastType] = useState<'success' | 'error'>('success'); // Type of toast (success/error)
  const [selectedExtras, setSelectedExtras] = useState<any[]>([]); // State to track selected extras, initialized as an empty array
  const [userId, setUserId] = useState<string | null>(null); // State to store user ID from local storage
  const [totalCostWithExtras, setTotalCostWithExtras] = useState<number>(parseFloat(totalCost)); // Total cost state

  // Retrieve userId from local storage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Safely parse the local storage item
        if (parsedUser?.id) {
          setUserId(parsedUser.id);
        } else {
          console.error('Invalid user data in local storage:', storedUser);
        }
      } catch (error) {
        console.error('Failed to parse user data from local storage:', error);
      }
    } else {
      console.error('User not found in local storage');
    }
  }, []);

  // Handle adding/removing extras to/from the cart
  const handleAddToCart = (extra: any, quantity: number) => {
    setSelectedExtras((prevExtras) => {
      // If quantity is 0, remove the extra from the cart
      if (quantity === 0) {
        return prevExtras.filter((item) => item.id !== extra.id);
      }

      // If the extra is already in the cart, update its quantity
      const existingExtra = prevExtras.find((item) => item.id === extra.id);
      if (existingExtra) {
        return prevExtras.map((item) =>
          item.id === extra.id ? { ...item, quantity } : item
        );
      }

      // If the extra is not in the cart, add it with the selected quantity
      return [...prevExtras, { ...extra, quantity }];
    });
  };

  // Calculate the total cost whenever selectedExtras changes
  useEffect(() => {
    // Ensure that selectedExtras is an array
    if (!Array.isArray(selectedExtras)) {
      console.error('Selected extras is not an array:', selectedExtras);
      return;
    }

    // Calculate the total cost of selected extras
    const extrasCost = selectedExtras.reduce((total, extra) => {    
        
      const extraPrice = parseFloat(extra.price_amount);        

      if (isNaN(extraPrice)) {
        console.error(`Invalid price_amount for extra ${extra.name}: ${extra.price_amount}`);
        return total; // Skip this extra if price is invalid
      }

      // Handle TRIP and DAILY price types
      if (extra.price_type === 'TRIP') {
        return total + extraPrice * (extra.quantity || 0); // Ensure `quantity` defaults to 0 if not defined
      } else if (extra.price_type === 'DAILY') {
        const numDays = calculateDaysBetween(startDate, endDate);
        return total + extraPrice * (extra.quantity || 0) * numDays; // Multiply by the number of days for DAILY extras
      }
      return total;
    }, 0);

    // Calculate the total cost including base cost, extras, and tax
    const totalWithExtras = parseFloat(totalCost) + extrasCost;
    const taxAmount = totalWithExtras * 0.0825; // Assuming 8.25% tax

    setTotalCostWithExtras(totalWithExtras + taxAmount);
  }, [selectedExtras, startDate, endDate, totalCost, extras]);

  // Helper function to calculate the number of days between two dates
  function calculateDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  }

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    try {
      if (!userId) {
        setToastMessage('User not logged in!');
        setToastType('error');
        return;
      }

      const payload = {
        car_id: carId,
        user_id: userId, // Use the userId retrieved from local storage
        start_date: startDate,
        end_date: endDate,
        total_price: totalCostWithExtras.toFixed(2), // Pass total cost to the API
        extras: selectedExtras, // Pass selected extras to the API
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setToastMessage('Booking confirmed successfully!');
        setToastType('success');
      } else {
        const data = await response.json();
        setToastMessage(data.error || 'An error occurred during booking.');
        setToastType('error');
      }
    } catch (error) {
      setToastMessage('An unexpected error occurred. Please try again.');
      setToastType('error');
    }
  };

  return (
    <div className="container mx-auto p-5 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-5">Confirm Your Booking</h1>

      {/* Trip Details */}
      <div className="bg-white p-5">
        <h2 className="text-lg font-medium mb-2">Your Trip</h2>
        <p><strong>Car id:</strong> {carId}</p>
        <p><strong>Dates:</strong> {new Date(startDate).toDateString()} - {new Date(endDate).toDateString()}</p>
      </div>

      {/* Extras Section */}
      <Extras
        extras={extras}
        availability={availability}
        onAddToCart={handleAddToCart} // Handle extras selection
      />

      {/* Price Breakdown */}
      <div className="bg-white p-5 mt-4">
        <h2 className="text-lg font-medium mb-2">Price Breakdown</h2>
        <p>Base Price: ${totalCost}</p>
        <p>Total Cost with Extras and Tax: ${totalCostWithExtras.toFixed(2)}</p>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleConfirmBooking}
        className="w-fit mt-10 bg-blue-500 text-white py-3 px-5 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Confirm and Pay
      </button>

      {/* Toast Notification */}
      {toastMessage && <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
