'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Extras from '../extras/box';
import { createBooking } from '../../../../lib/db/db';
import { useRouter } from 'next/navigation';
import PaypalButtons from './PaypalButtons';
import { useUser } from '@/components/contexts/UserContext';
import { Vehicle } from '@/types';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import {Extra} from '@/types/index';

interface PaypalData {
  paypal_order_id: string;
  paypal_transaction_id: string;
  is_paid: boolean;
}

interface PaymentPageProps {
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  subTotal: number;
  extras: Extra[];
  availability: any;
  onBackToDetails: () => void;
}

const Payment: React.FC<PaymentPageProps> = ({
  vehicle,
  startDate,
  endDate,
  subTotal,
  extras,
  availability,
  onBackToDetails,
}) => {
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);

  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();

  useEffect(() => {
    updateTotalPrice();
  }, [selectedExtras]);

  const updateTotalPrice = () => {
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
    );

    const extrasCost = selectedExtras.reduce((total, extra) => {
      const cost =
        extra.price_type === 'DAILY'
          ? extra.price_amount * (extra.quantity || 1) * days
          : extra.price_amount * (extra.quantity || 1);
      return total + cost;
    }, 0);

    const subtotal = subTotal + extrasCost;
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
    if (!userId) {
      router.push('/login');
      return;
    }

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
      const response = await createBooking(payload);
      if (response?.id) {
        router.push(`/confirmation/${response.id}`);
      } else {
        console.error('Booking could not be confirmed.');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto p-6 rounded-lg space-y-6 mt-3">
      <button onClick={onBackToDetails} className="flex items-center text-blue-600 font-semibold mb-3">
        <FaArrowLeft className="mr-2" /> Back
      </button>
      {/* Unified Card */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg space-y-8">
        {/* Extras */}
        <Extras extras={extras} availability={availability} onAddToCart={handleAddToCart} />
      </div>
      <div className="bg-white border border-gray-200 p-6 rounded-lg space-y-8">
        {/* Price Summary */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3"> Price Summary</h2>
          <div className="flex justify-between text-gray-700 mb-1">
            <span>Subtotal:</span>
            <span>${subTotal.toFixed(2)}</span>
          </div>
          {selectedExtras.length > 0 && (
            <div className="text-gray-700 mb-1">
              <ul>
                {selectedExtras.map((extra) => {
                  const quantity = extra.quantity ?? 1;
                  const days = Math.ceil(
                    (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
                  );
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
          <div className="flex justify-between text-gray-700 mb-3">
            <span>Tax (8.25%):</span>
            <span>+ ${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center border-t-2 pt-3 mt-3">
            <span className="font-bold text-lg">Total:</span>
            <span className="text-xl font-bold text-gray-800">${totalPrice.toFixed(2)}</span>
          </div>
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
