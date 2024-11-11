'use client';

import React, { useState, useEffect } from 'react';
import Extras from '../extras/box';
import { useRouter } from 'next/navigation';
import PaypalButtons from './PaypalButtons';
import { useUser } from '@/components/contexts/UserContext';
import { Vehicle } from '@/types';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Extra } from '@/types/index';
import { differenceInDays, format } from 'date-fns';

interface PaypalData {
  paypal_order_id: string;
  paypal_transaction_id: string;
  is_paid: boolean;
}

interface PaymentPageProps {
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  extras: Extra[];
  availability: any;
  onBackToDetails: () => void;
}

const Payment: React.FC<PaymentPageProps> = ({
  vehicle,
  startDate,
  endDate,
  extras,
  availability,
  onBackToDetails,
}) => {
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();

  const calculateDays = () => differenceInDays(new Date(endDate), new Date(startDate)) + 1;

  const calculateTotals = () => {
    const calculatedDays = calculateDays();
    setDays(calculatedDays);

    const vehicleSubtotal = vehicle.price * calculatedDays;
    const extrasCost = selectedExtras.reduce((total, extra) => {
      const cost =
        extra.price_type === 'DAILY'
          ? extra.price_amount * (extra.quantity || 1) * calculatedDays
          : extra.price_amount * (extra.quantity || 1);
      return total + cost;
    }, 0);

    const updatedSubtotal = vehicleSubtotal + extrasCost;
    const updatedTax = parseFloat((updatedSubtotal * 0.0825).toFixed(2));
    setTaxAmount(updatedTax);

    const updatedTotalPrice = updatedSubtotal + updatedTax;
    setTotalPrice(parseFloat(updatedTotalPrice.toFixed(2)));
  };

  useEffect(() => {
    calculateTotals();
  }, [startDate, endDate, selectedExtras]);

  const handleAddToCart = (extra: Extra, quantity: number) => {
    setSelectedExtras((prev) => {
      const updatedExtras = prev.filter((item) => item.id !== extra.id);
      if (quantity > 0) updatedExtras.push({ ...extra, quantity });
      return updatedExtras;
    });
  };

  const handlePaymentSuccess = async (paypalData: PaypalData) => {
    const payload = {
      vehicle_id: vehicle.id,
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
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload), 
        credentials: 'include', // Ensures cookies are sent with the request
      });

      // Parse JSON response
      const responseData = await response.json();

      if (responseData?.id) {
        router.push(`/book/${responseData.id}`);
      } else {
        console.error('Booking could not be confirmed.');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const formattedStartDate = format(new Date(startDate), 'MMM dd, yyyy');
  const formattedEndDate = format(new Date(endDate), 'MMM dd, yyyy');

  return (
    <div className="max-w-3xl w-full mx-auto p-6 rounded-lg space-y-6 mt-3">
      <button onClick={onBackToDetails} className="flex items-center text-blue-600 font-semibold mb-3">
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Unified Card */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <Extras extras={extras} availability={availability} onAddToCart={handleAddToCart} />
      </div>

      {/* Booking Summary Card */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking Summary</h2>

        {/* Date Information */}
        <div className="flex justify-between text-md text-gray-700">
          <p>From:</p>
          <p className="font-medium">{formattedStartDate}</p>
        </div>
        <div className="flex justify-between text-md text-gray-700">
          <p>To:</p>
          <p className="font-medium">{formattedEndDate}</p>
        </div>
        {/* Extras Section */}
        {selectedExtras.length > 0 && (
          <>
            <hr className="my-4 border-gray-300" />
            <ul className="space-y-1">
              {selectedExtras.map((extra) => {
                const quantity = extra.quantity ?? 1;
                const extraCost =
                  extra.price_type === 'DAILY'
                    ? extra.price_amount * quantity * days
                    : extra.price_amount * quantity;

                return (
                  <li key={extra.id} className="flex justify-between text-md text-gray-700">
                    <span>{extra.name} ({extra.price_type === 'DAILY' ? `x ${days} days` : 'one-time'}):</span>
                    <span className="font-medium">+ ${extraCost.toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        {/* Divider */}
        <hr className="my-4 border-gray-300" />

        {/* Booking Details */}
        <div className="flex justify-between text-md text-gray-700">
          <p>Daily rate:</p>
          <p className="font-medium">${vehicle.price.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-md text-gray-700">
          <p>Total days:</p>
          <p className="font-medium">x {days} {days === 1 ? 'day' : 'days'}</p>
        </div>
        <div className="flex justify-between text-md text-gray-700">
          <p>Tax (8.25%):</p>
          <p className="font-medium">+ ${taxAmount.toFixed(2)}</p>
        </div>
        

        {/* Final Divider */}
        <hr className="my-4 border-gray-300" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Total:</span>
          <span className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Payment Method</h2>
        <div className="flex justify-center">
          <PaypalButtons key={totalPrice} totalPrice={totalPrice} onPaymentSuccess={handlePaymentSuccess} />
        </div>
      </div>
    </div>
  );
};

export default Payment;