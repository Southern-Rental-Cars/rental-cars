'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Toast from '../../../components/Toast';
import Extras from './Extras';
import { fetchCarById, createBooking } from '../../../lib/db/queries';
import { useRouter } from 'next/navigation';

interface BookViewProps {
  carId: string;
  startDate: string;
  endDate: string;
  totalCost: string;
  extras: any[]; 
  availability: any;
}

const TAX_RATE = 8.25; // Tax rate

const BookView: React.FC<BookViewProps> = ({
  carId,
  startDate,
  endDate,
  totalCost,
  extras,
  availability,
}) => {
  const [selectedExtras, setSelectedExtras] = useState<any[]>([]);
  const [totalCostWithExtras, setTotalCostWithExtras] = useState<number>(parseFloat(totalCost));
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [carName, setCarName] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user ID from local storage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.id) setUserId(parsedUser.id);
    }
  }, []);

  // Fetch car details by ID
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const car = await fetchCarById(parseInt(carId));
        setCarName(`${car.make} ${car.model} ${car.year}`);
      } catch (error) {
        setToastMessage('Failed to fetch car details.');
        setToastType('error');
      }
    };
    fetchCarDetails();
  }, [carId]);

  // Calculate total cost (without tax) and update total
  const calculateTotalCost = useCallback((selectedExtras: any[]) => {
    let total = parseFloat(totalCost);

    selectedExtras.forEach((extra) => {
      if (extra.price_type === 'DAILY') {
        const days = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24));
        total += extra.price_amount * extra.quantity * days;
      } else {
        total += extra.price_amount * extra.quantity;
      }
    });

    const tax = total * (TAX_RATE / 100);
    setTaxAmount(tax);
    setTotalCostWithExtras(total + tax);
  }, [startDate, endDate, totalCost]);

  // Handle extras selection
  const handleAddToCart = (extra: any, quantity: number) => {
    setSelectedExtras((prev) => {
      const updatedExtras = prev.filter((item) => item.id !== extra.id);
      if (quantity > 0) updatedExtras.push({ ...extra, quantity });

      calculateTotalCost(updatedExtras);
      return updatedExtras;
    });
  };

  // Handle booking confirmation
  const handleConfirmBooking = async () => {
    if (!userId) {
      setToastMessage('User not logged in!');
      setToastType('error');
      return;
    }

    const payload = {
      car_id: carId,
      car_name: carName,
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
      total_price: totalCostWithExtras.toFixed(2),
      extras: selectedExtras,
    };

    try {
      const response = await createBooking(payload);
      if (response?.id) {
        router.push(`/confirmation/${response.id}`);
      } else {
        setToastMessage('Error during booking.');
        setToastType('error');
      }
    } catch (error) {
      setToastMessage('Unexpected error. Please try again.');
      setToastType('error');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-gray-50 rounded-lg shadow-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center">Confirm Booking</h1>
      
      {/* Car Details */}
      <div className="bg-white p-6 mb-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-medium mb-4">Your Trip Details</h2>
        <p className="text-gray-700 mb-2"><strong>Car:</strong> {carName || 'Fetching car details...'}</p>
        <p className="text-gray-700 mb-2"><strong>Start Date:</strong> {new Date(startDate).toLocaleDateString()}</p>
        <p className="text-gray-700 mb-2"><strong>End Date:</strong> {new Date(endDate).toLocaleDateString()}</p>
      </div>

      {/* Extras Section */}
      <Extras extras={extras} availability={availability} onAddToCart={handleAddToCart} />

      {/* Price Breakdown */}
      <div className="bg-white p-6 mt-6 rounded-lg shadow-md border border-gray-200">
        <h2 className="text-xl font-medium mb-4">Price Breakdown</h2>
        <p className="text-gray-700 mb-2"><strong>Base Price:</strong> ${totalCost}</p>
        <p className="text-gray-700 mb-2"><strong>Tax ({TAX_RATE}%):</strong> ${taxAmount.toFixed(2)}</p>
        <p className="text-gray-700"><strong>Total Cost (extras + tax):</strong> ${totalCostWithExtras.toFixed(2)}</p>
      </div>
      {/* Confirm Button and Toast Container */}
      <div className="relative flex flex-col items-center mt-8">
        <button
          onClick={handleConfirmBooking}
          className="bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg shadow hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Confirm and Pay
        </button>

        {/* Toast Notification */}
        {toastMessage && (
          <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage(null)} />
        )}
      </div>
    </div>
  );
};

export default BookView;

