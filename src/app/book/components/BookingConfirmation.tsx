import React from 'react';

interface BookingConfirmationProps {
  carName: string;
  carId: number;
  startDate: string;
  endDate: string;
  selectedExtras: any[];
  totalCost: number;
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ carName, startDate, endDate, selectedExtras, totalCost }) => {
  return (
    <div className="container mx-auto p-5 max-w-4xl">
      <h1 className="text-3xl font-semibold mb-5">Booking Confirmation</h1>

      <div className="bg-white p-5 rounded-lg mb-5">
        <h2 className="text-lg font-medium mb-2">Your Booking</h2>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="font-semibold">Car: {carName}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-gray-700">Start Date:</p>
            <p className="font-semibold">{new Date(startDate).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-3">
          <div>
            <p className="text-gray-700">End Date:</p>
            <p className="font-semibold">{new Date(endDate).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-5 rounded-lg mb-5">
        <h2 className="text-lg font-medium mb-2">Price Details</h2>
        <p className="text-lg font-semibold mt-4">Total: ${totalCost}</p>
      </div>

      <button
        onClick={() => window.location.href = '/vehicles'} // Redirect to the vehicle page or homepage
        className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition"
      >
        Back to Vehicles
      </button>
    </div>
  );
};

export default BookingConfirmation;
