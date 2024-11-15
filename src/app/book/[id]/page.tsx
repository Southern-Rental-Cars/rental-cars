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

  // Delivery Information
  const isDelivery = booking.delivery_required;
  const deliveryInfo = isDelivery
    ? booking.delivery_type === 'local'
      ? { type: 'Local Delivery', address: booking.delivery_address }
      : { type: 'IAH Airport Delivery', address: 'George Bush Intercontinental Airport, 2800 N Terminal Rd, Houston, TX 77032' }
    : null;

  return (
    <div className="flex flex-col items-center bg-gray-50 px-4 pt-10 pb-6 md:px-8 lg:px-12 min-h-screen">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header with Logo */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">Booking Confirmed!</h1>
          <p className="text-gray-600 mt-2">Thank you for choosing Southern Rental Cars.</p>
          <Image src={southernLogo} alt="Southern Car Rentals Logo" width={100} height={30} className="mx-auto mt-4" />
        </div>

        {/* Vehicle Card */}
        <Card title="Vehicle">
          <div className="w-full h-56 md:h-64 rounded-lg overflow-hidden mb-4">
            <Image
              src={vehicle.thumbnail}
              alt={`${vehicleName} Image`}
              layout="responsive"
              width={400}
              height={250}
              className="object-cover rounded-lg"
            />
          </div>
          <p className="text-lg font-semibold text-gray-900 mb-2">{vehicleName}</p>
          <div className="grid grid-cols-2 gap-y-1 text-gray-700">
            <div><span className="font-semibold">Doors:</span> {vehicle.num_doors}</div>
            <div><span className="font-semibold">Seats:</span> {vehicle.num_seats}</div>
            <div><span className="font-semibold">Gas Type:</span> {vehicle.gas_type}</div>
            <div><span className="font-semibold">MPG:</span> {vehicle.mpg}</div>
          </div>
        </Card>

        {/* Dates Card */}
        <Card title="Rental Dates">
          <div className="flex flex-col space-y-1 text-gray-700">
            <p><span className="font-semibold">Start:</span> {formattedStartDate}</p>
            <p><span className="font-semibold">End:</span> {formattedEndDate}</p>
          </div>
        </Card>

        {/* Driver Card */}
        <Card title="Driver Information">
          <p className="text-gray-700">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
        </Card>

        {/* Delivery Information Card */}
        {isDelivery && (
          <Card title="Delivery Details">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Delivery Type:</span> {deliveryInfo?.type}
            </p>
            {deliveryInfo?.address && (
              <p className="text-gray-700">
                <span className="font-semibold">Delivery Address:</span> {deliveryInfo.address}
              </p>
            )}
          </Card>
        )}

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
          <div className="flex justify-between text-lg font-semibold text-gray-900 mt-2">
            <span>Total Paid:</span>
            <span className="text-lg font-bold">${parseFloat(booking.total_price).toFixed(2)}</span>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Reusable Card component
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-3">{title}</h2>
    <div className="border-t border-gray-300 mb-4"></div>
    {children}
  </div>
);

export default Confirmation;
