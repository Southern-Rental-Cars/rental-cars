import { fetchBookingById } from '@/lib/db/queries';
import React from 'react';

interface Extra {
  id: number;
  booking_id: number;
  extra_id: number;
  extra_name: string | null;
  quantity: number;
}

interface ConfirmationProps {
  params: { id: string };
}

const Confirmation = async ({ params }: ConfirmationProps) => {
  const bookingId = params.id;
  const booking = await fetchBookingById(bookingId);
  if (!booking) {
    return <div className="text-center text-lg mt-10">Booking not found</div>;
  }
  
  const {
    vehicle: { make, model, year },
    start_date: startDate,
    end_date: endDate,
    bookingExtras,
    total_price: totalPrice,
    paypal_transaction_id: transactionId, // Fetch the transaction ID if needed
  } = booking;
  
  const vehicleName = `${year} ${make} ${model}`;

  return (
    <div className="container mx-auto p-6 max-w-3xl">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-4 text-center">Booking Confirmation</h1>
        {/* Booking Details Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Booking Details</h2>
          <div className="border-t border-gray-300 my-2"></div>
          <p className="text-lg font-bold">{vehicleName}</p>
          <p className="text-gray-700">
            <span className="font-semibold">From:</span> {new Date(startDate).toLocaleDateString()}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">To:</span> {new Date(endDate).toLocaleDateString()}
          </p>
          {/* Show Booking ID */}
          <p className="text-gray-700">
            <span className="font-semibold">Booking Number:</span> {bookingId}
          </p>
        </div>

        {/* Extras Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Extras</h2>
          <div className="border-t border-gray-300 my-2"></div>
          {bookingExtras.length > 0 ? (
            <ul className="space-y-1">
              {bookingExtras.map((extra: Extra) => (
                <li key={extra.id} className="flex justify-between">
                  <span>{extra.extra_name || `Extra ${extra.extra_id}`}</span>
                  <span className="text-gray-700">x{extra.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No extras added to this booking</p>
          )}
        </div>

        {/* Price Details Section */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Payment Summary</h2>
          <div className="border-t border-gray-300 my-2"></div>
          <div className="flex justify-between">
            <span className="font-semibold text-lg">Total paid:</span>
            <span className="text-lg font-bold">${parseFloat(totalPrice).toFixed(2)}</span>
          </div>
          {/* Show Transaction ID if necessary */}
          {transactionId && (
            <p className="text-gray-700">
              <span className="font-semibold">Transaction ID:</span> {transactionId}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
