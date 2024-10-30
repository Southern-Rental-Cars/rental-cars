import { fetchBookingById, fetchUserById } from '@/lib/db/db';
import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import southernLogo from '@/images/transparent_southern_logo_3.png';
import {Extra, ConfirmationProps} from '@/types/index';

const Confirmation = async ({ params }: ConfirmationProps) => {
  /* Fetch booking information */
  const bookingId = params.id;
  const booking = await fetchBookingById(bookingId);

  if (!booking) {
    return <div className="text-center text-lg mt-10">Booking not found</div>;
  }

  /* Fetch customer profile information */
  const userId = booking.user_id;
  const user = await fetchUserById(userId);
  if (!user) {
    return <div className="text-center text-lg mt-10">User not found</div>;
  }

  const {
    vehicle: { make, model, year },
    start_date: startDate,
    end_date: endDate,
    bookingExtras,
    total_price: totalPrice,
    paypal_transaction_id: transactionId,
  } = booking;

  const vehicleName = `${year} ${make} ${model}`;
  const formattedStartDate = format(new Date(startDate), 'EEE MMM do, hh:mm a');
  const formattedEndDate = format(new Date(endDate), 'EEE MMM do, hh:mm a');

  return (
    <div className="flex justify-center bg-gray-50 p-4 md:p-12">
      <div className="bg-white px-6 py-8 rounded-lg border border-gray-200 w-full max-w-lg md:max-w-2xl md:px-12 relative">
        {/* Southern Car Rentals Logo aligned with heading */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Booking Confirmed!</h1>
          <Image src={southernLogo} alt="Southern Car Rentals Logo" width={80} height={24} />
        </div>

        {/* Booking Number and Vehicle Information */}
        <div className="space-y-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Booking #{bookingId}</h2>
          <div className="border-t border-gray-300 my-2"></div>
          <p className="text-lg font-bold text-gray-900">{vehicleName}</p>
          {/* User Email */}
          <p className="text-gray-700">
            <span className="font-semibold">Recipient:</span> {user.user.email}
          </p>
          <div className="text-gray-700">
            <p><span className="font-semibold">Start:</span> {formattedStartDate}</p>
            <p><span className="font-semibold">End:</span> {formattedEndDate}</p>
          </div>
        </div>

        {/* Extras Section */}
        <div className="space-y-3 mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Extras</h2>
          <div className="border-t border-gray-300 my-2"></div>
          {bookingExtras.length > 0 ? (
            <ul className="space-y-1 text-gray-700">
              {bookingExtras.map((extra: Extra) => (
                <li key={extra.id} className="flex justify-between">
                  <span>{extra.extra_name || `Extra ${extra.extra_id}`}</span>
                  <span>x{extra.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No extras added to this booking</p>
          )}
        </div>

        {/* Payment Summary */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-800">Payment Summary</h2>
          <div className="border-t border-gray-300 my-2"></div>
          
          {/* Transaction ID */}
          {transactionId && (
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Transaction ID:</span> {transactionId}
            </p>
          )}
          
          {/* Total Paid */}
          <div className="flex justify-between">
            <span className="font-semibold text-lg text-gray-900">Total paid:</span>
            <span className="text-lg font-bold text-gray-900">${parseFloat(totalPrice).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
