'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { format } from 'date-fns';
import Extras from '../extras/ExtrasBox';
import { createBooking } from '../../../../lib/db/db';
import { useRouter } from 'next/navigation';
import PaypalButtons from './PaypalButtons';
import { useUser } from '@/components/contexts/UserContext';

interface Extra {
  id: number;
  name: string;
  price_amount: number;
  price_type: 'DAILY' | 'TRIP';
  quantity?: number;
}

interface VehicleDetails {
  year: number;
  gas_type: string;
  num_seats: number;
  num_doors: number;
  mpg: number;
}

interface PaypalData {
  paypal_order_id: string;
  paypal_transaction_id: string;
  is_paid: boolean;
}

interface PaymentPageProps {
  vehicleId: number;
  vehicleName: string;
  vehicleDetails: VehicleDetails;
  startDate: string;
  endDate: string;
  basePrice: number;
  extras: Extra[];
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
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false); // To track the loading state
  const [error, setError] = useState<string | null>(null); // To track error messages

  const { user } = useUser(); // Assuming `user` contains the logged-in user's data
  const userId = user?.id; // Extract the userId from the context

  const router = useRouter();

  useEffect(() => {
    // Calculate total cost when selectedExtras changes
    updateTotalPrice();
  }, [selectedExtras]);

  const formattedStartDate = useMemo(
    () => format(new Date(startDate), 'EEE MMM do, hh:mm a'),
    [startDate]
  );
  const formattedEndDate = useMemo(
    () => format(new Date(endDate), 'EEE MMM do, hh:mm a'),
    [endDate]
  );

  // Regular function instead of useCallback
  const updateTotalPrice = () => {
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    ) + 1; // Adding 1 to include the end date as a full day

    const extrasCost = selectedExtras.reduce((total, extra) => {
      const cost =
        extra.price_type === 'DAILY'
          ? extra.price_amount * (extra.quantity || 1) * days
          : extra.price_amount * (extra.quantity || 1);
      return total + cost;
    }, 0);

    const subtotal = basePrice + extrasCost;
    const calculatedTax = parseFloat((subtotal * 0.0825).toFixed(2)); 
    setTaxAmount(calculatedTax);
    setTotalPrice(parseFloat((subtotal + calculatedTax).toFixed(2))); 
  };

  const handleAddToCart = (extra: Extra, quantity: number) => {
    setSelectedExtras((prev) => {
      const updatedExtras = prev.filter((item) => item.id !== extra.id);
      if (quantity > 0) updatedExtras.push({ ...extra, quantity });
      return updatedExtras;
    });
  };

const handlePaymentSuccess = async (paypalData: PaypalData) => {
      // Redirect to login if the user is not logged in
  if (!userId) {
    router.push('/login');
    return;
  }
  setIsProcessing(true); // Start the loading state
  setError(null); // Clear any previous error messages

  const payload = {
    vehicle_id: vehicleId,
    user_id: userId,
    start_date: startDate,
    end_date: endDate,
    total_price: totalPrice.toFixed(2),
    extras: selectedExtras,
    paypal_order_id: paypalData.paypal_order_id,
    paypal_transaction_id: paypalData.paypal_transaction_id,
    is_paid: paypalData.is_paid,
  };

  try {
    // Create the booking on the backend
    const response = await createBooking(payload);

    if (response?.id) {
      // Redirect to confirmation page
      router.push(`/confirmation/${response.id}`);
    } else {
      // Handle any errors returned from the backend
      setError('Booking could not be confirmed.');
    }
  } catch (error) {
    // Catch and display network errors or other issues
    setError('An error occurred while confirming your booking. Please try again.');
    console.error('Error confirming booking:', error);
  } finally {
    setIsProcessing(false); // Stop the loading state
  }
};

  return (
    <div className="max-w-7xl w-full mx-auto p-6 bg-white rounded-lg mt-8">
      <button onClick={onBackToDetails} className="mb-6 text-blue-500 hover:text-blue-700 transition duration-200 text-lg font-medium">  ← Back </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
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
          <Extras extras={extras} availability={availability} onAddToCart={handleAddToCart} />
        </div>
        <div className="space-y-6">
        <div className="bg-white p-5 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold mb-6 text-gray-800">Price details</h2>
          {/* Subtotal */}
          <div className="flex justify-between text-gray-700 mb-3">
            <span>Subtotal:</span>
            <span>${basePrice.toFixed(2)}</span>
          </div>
          {/* Extras */}
          {selectedExtras.length > 0 && (
            <div className="text-gray-700 mb-3">
              <ul>
                {selectedExtras.map((extra) => {
                  const quantity = extra.quantity ?? 1;
                  const days = Math.ceil(
                    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
                  ) + 1;
                  const extraCost =
                    extra.price_type === 'DAILY'
                      ? extra.price_amount * quantity * days
                      : extra.price_amount * quantity;

                  return (
                    <li key={extra.id} className="flex justify-between">
                      <span>{extra.name} ({extra.price_type === 'DAILY' ? `x ${days} days` : 'one-time'}):</span>
                      <span>${extraCost.toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          {/* Tax */}
          <div className="flex justify-between text-gray-700 mb-3">
            <span>Tax (8.25%):</span>
            <span>+ ${taxAmount.toFixed(2)}</span>
          </div>
          {/* Total */}
          <div className="flex justify-between items-center border-t-2 pt-3 mt-3">
            <span className="font-bold text-lg">Total:</span>
            <span className="text-xl font-bold text-gray-800">${totalPrice.toFixed(2)}</span>
          </div>
        </div>
          <div className="bg-white p-5 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-6 text-gray-800">Payment Method</h2>
            <div className="flex justify-center">
              <PaypalButtons key={totalPrice} totalPrice={totalPrice} onPaymentSuccess={handlePaymentSuccess} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
