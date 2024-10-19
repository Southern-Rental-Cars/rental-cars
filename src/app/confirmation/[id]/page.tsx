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
  const bookingId = parseInt(params.id, 10);
  const booking = await fetchBookingById(bookingId);
  if (!booking) {
    return <div className="text-center text-lg mt-10">Booking not found</div>;
  }

  const { car_name: carName, start_date: startDate, end_date: endDate, bookingExtras, total_price: totalPrice } = booking;
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-6">Booking Confirmation</h1>

      {/* Trip Details */}
      <div className="bg-white p-6 mb-6 rounded-lg border border-gray-200">
        <div>
          <h2 className="text-xl font-medium mb-4">Booking Details</h2>
          <p className="text-lg">{carName}</p>
        </div>
        <div>
          <div>
            <p className="text-gray-700">From: {new Date(startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <p className="text-gray-700">To: {new Date(endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Extras Section */}
      <div className="bg-white p-6 mb-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-medium mb-4">Extras</h2>
        {bookingExtras.length > 0 ? (
          bookingExtras.map((extra: Extra) => (
            <div key={extra.id} className="flex justify-between">
              <p>{extra.extra_name || `Extra ${extra.extra_id}`}</p>
              <p>x{extra.quantity}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No extras added to this booking</p>
        )}
      </div>

      {/* Price Details */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <p className="text-lg font-semibold">Total Payment: ${parseFloat(totalPrice).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Confirmation;
