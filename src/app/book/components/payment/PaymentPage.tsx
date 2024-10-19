'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns'; // Import date-fns for consistent date formatting
import Extras from '../extras/ExtrasBox';
import { createBooking } from '../../../../lib/db/queries';
import { useRouter } from 'next/navigation';
import PaypalButtons from './PaypalButtons';

interface PaymentPageProps {
  vehicleId: number;
  vehicleName: string;
  vehicleDetails: {
    year: number;
    gas_type: string;
    num_seats: number;
    num_doors: number;
    mpg: number;
  };
  startDate: string;
  endDate: string;
  basePrice: number;
  extras: any[];
  availability: any;
  onBackToDetails: () => void;
}

const Payment: React.FC<PaymentPageProps> = ({
  vehicleId,
  vehicleName,
  vehicleDetails,
  startDate,
  endDate,
  basePrice,
  extras,
  availability,
  onBackToDetails,
}) => {
  const [selectedExtras, setSelectedExtras] = useState<any[]>([]);
  const [totalCost, setTotalCost] = useState<number>(basePrice);
  const [taxAmount, setTaxAmount] = useState<number>(basePrice * (8.25 / 100)); // Initial tax on base price
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser?.id) setUserId(parsedUser.id);
    }
  }, []);

  const formattedStartDate = format(new Date(startDate), 'EEE MMM do, hh:mm a');
  const formattedEndDate = format(new Date(endDate), 'EEE MMM do, hh:mm a');

  const calculateTotalCost = useCallback(
    (selectedExtras: any[]) => {
      let total = basePrice;
      selectedExtras.forEach((extra) => {
        if (extra.price_type === 'DAILY') {
          const days = Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
          );
          total += extra.price_amount * extra.quantity * days;
        } else {
          total += extra.price_amount * extra.quantity;
        }
      });
      const tax = total * (8.25 / 100); // Recalculate tax based on new total
      setTaxAmount(tax);
      setTotalCost(total + tax); // Update total cost including tax
    },
    [startDate, endDate, basePrice]
  );

  const handleAddToCart = (extra: any, quantity: number) => {
    setSelectedExtras((prev) => {
      const updatedExtras = prev.filter((item) => item.id !== extra.id);
      if (quantity > 0) updatedExtras.push({ ...extra, quantity });
      calculateTotalCost(updatedExtras);
      return updatedExtras;
    });
  };

  const handlePaymentSuccess = async () => {
    console.log("INSIDE PAYMENT SUCCESS");
    if (!userId) {
      console.log("NOTHING INSIDE");
      return;
    }
    const payload = {
      car_id: vehicleId,
      car_name: vehicleName,
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
      total_price: totalCost.toFixed(2),
      extras: selectedExtras,
    };
    try {
      const response = await createBooking(payload);
      if (response?.id) {
        router.push(`/confirmation/${response.id}`);
      } else {
        console.error('Booking could not be confirmed');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  return (
    <div className="max-w-7xl w-full mx-auto p-6 bg-white rounded-lg mt-8">
      {/* Back */}
      <button
        onClick={onBackToDetails}
        className="mb-6 text-blue-500 hover:text-blue-700 transition duration-200 text-lg font-medium"
      >
        ← Back
      </button>
      {/* Main layout with two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Booking details & Extras */}
        <div className="space-y-6">
          {/* Booking Details */}
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Booking details</h2>
            <div className="grid grid-cols-2 text-sm mb-3">
              <p><strong>Name:</strong> {vehicleName}</p>
              <p><strong>Year:</strong> {vehicleDetails.year}</p>
              <p><strong>Type:</strong> {vehicleDetails.gas_type}</p>
              <p><strong>Seats:</strong> {vehicleDetails.num_seats}</p>
              <p><strong>Doors:</strong> {vehicleDetails.num_doors}</p>
              <p><strong>MPG:</strong> {vehicleDetails.mpg}</p>
            </div>
            <p className="text-gray-700 mb-2"><strong>From:</strong> {formattedStartDate}</p>
            <p className="text-gray-700"><strong>To:</strong> {formattedEndDate}</p>
          </div>
          {/* Extras Selection */}
          <Extras extras={extras} availability={availability} onAddToCart={handleAddToCart} />
        </div>

        {/* Right Column: Price details and payment */}
        <div className="space-y-6">
          {/* Price Breakdown */}
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Price breakdown</h2>
            <p className="text-gray-700 mb-3"><strong>Subtotal:</strong> ${basePrice.toFixed(2)}</p>
            {selectedExtras.length > 0 && (
              <div className="text-gray-700 mb-3">
                <strong>Extras:</strong>
                <ul className="pl-4 list-disc">
                  {selectedExtras.map((extra) => (
                    <li key={extra.id}>
                      {extra.name} (${extra.price_amount.toFixed(2)} x {extra.quantity})
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-gray-700 mb-3"><strong>Tax (8.25%):</strong> ${taxAmount.toFixed(2)}</p>
            <p className="text-gray-700 font-bold text-lg">Total: ${totalCost.toFixed(2)}</p>
          </div>

          {/* Payment Section */}
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Payment Method</h2>
            <div className="flex justify-center">
              <PaypalButtons totalPrice={totalCost} onPaymentSuccess={handlePaymentSuccess}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
