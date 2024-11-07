import { fetchBookingById, fetchUserById, fetchVehicleById } from '@/utils/db/db';
import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import southernLogo from '@/images/transparent_southern_logo_3.png';
import { Extra, ConfirmationProps } from '@/types/index';
import { cookies } from 'next/headers';

const Confirmation = async ({ params }: ConfirmationProps) => {
  const token = cookies().get('token')?.value;

  // Fetch booking details
  const booking = await fetchBookingById(params.id, token);
  if (!booking) {
    return <div className="text-center text-lg mt-10">Booking not found</div>;
  }

  // Fetch user details
  const user = await fetchUserById(token);
  if (!user) {
    return <div className="text-center text-lg mt-10">User not found</div>;
  }

  // Fetch vehicle details, including thumbnail and additional information
  const vehicle = await fetchVehicleById(booking.vehicle_id);
  if (!vehicle) {
    return <div className="text-center text-lg mt-10">Vehicle not found</div>;
  }

  const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
  const formattedStartDate = format(new Date(booking.start_date), 'EEE MMM do, hh:mm a');
  const formattedEndDate = format(new Date(booking.end_date), 'EEE MMM do, hh:mm a');

  return (
    <div className="flex justify-center bg-gray-50 px-4 pt-8 pb-4 md:px-6 lg:pt-12 lg:pb-6 lg:px-12 min-h-screen">
      <div className="w-full max-w-lg md:max-w-2xl space-y-6">
        {/* Header with Logo */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mt-4 md:mt-0">Booking Confirmed!</h1>
          <Image src={southernLogo} alt="Southern Car Rentals Logo" width={80} height={24} />
        </div>

        {/* Vehicle Card */}
        <Card title="Vehicle">
          <div className="w-full h-48 md:h-60 rounded-lg overflow-hidden mb-4">
            <Image
              src={vehicle.thumbnail}
              alt={`${vehicleName} Image`}
              layout="responsive"
              width={400}
              height={250}
              className="object-cover rounded-lg"
            />
          </div>
          <p className="text-lg font-semibold text-gray-900">{vehicleName}</p>
          <p className="text-gray-700 mb-4">{vehicle.short_description}</p>
          <ul className="text-gray-700 space-y-1">
            <li><span className="font-semibold">Doors:</span> {vehicle.num_doors}</li>
            <li><span className="font-semibold">Seats:</span> {vehicle.num_seats}</li>
            <li><span className="font-semibold">Gas Type:</span> {vehicle.gas_type}</li>
            <li><span className="font-semibold">MPG:</span> {vehicle.mpg}</li>
          </ul>
        </Card>

        {/* Dates Card */}
        <Card title="Dates">
          <p className="text-gray-700">
            <span className="font-semibold">Start:</span> {formattedStartDate}
          </p>
          <p className="text-gray-700">
            <span className="font-semibold">End:</span> {formattedEndDate}
          </p>
        </Card>

        {/* Driver Card */}
        <Card title="Driver">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </Card>

        {/* Extras Card */}
        <Card title="Extras">
          {booking.bookingExtras.length > 0 ? (
            <ul className="space-y-1 text-gray-700">
              {booking.bookingExtras.map((extra: Extra) => (
                <li key={extra.id} className="flex justify-between">
                  <span>{extra.extra_name || `Extra ${extra.id}`}</span>
                  <span>x{extra.quantity}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No extras added to this booking</p>
          )}
        </Card>

        {/* Payment Card */}
        <Card title="Payment Summary">
          {booking.paypal_transaction_id && (
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Transaction ID:</span> {booking.paypal_transaction_id}
            </p>
          )}
          <div className="flex justify-between">
            <span className="font-semibold text-lg text-gray-900">Total paid:</span>
            <span className="text-lg font-bold text-gray-900">${parseFloat(booking.total_price).toFixed(2)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Reusable Card component for each section with gray border
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
    <div className="border-t border-gray-300 mb-4"></div>
    {children}
  </div>
);

export default Confirmation;
