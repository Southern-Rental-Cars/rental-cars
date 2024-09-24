'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGasPump, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation'; // Import the useRouter for redirecting

interface BookingCardProps {
  carId: number;
  carName: string;
  carPrice: number;
  carDetails: {
    shortDescription: string;
    numDoors: number;
    numSeats: number;
    mpg: number;
    gasType: string;
  };
}

const BookingCard = ({ carId, carName, carPrice, carDetails }: BookingCardProps) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter(); // Initialize Next.js router for redirection

  // Function to automatically calculate the total cost when both dates are selected
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (end <= start) {
        setErrorMessage("End date must be after the start date.");
        setTotalCost(null); // Reset total cost when dates are invalid
        return;
      }

      // Calculate the number of days
      const timeDiff = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // Calculate the total cost
      const total = diffDays * carPrice;
      setTotalCost(total);
      setErrorMessage(null); // Clear previous errors
    }
  }, [startDate, endDate, carPrice]);

  const handleReserve = async () => {
    if (!startDate || !endDate || totalCost === null) {
      setErrorMessage("Please fill out all fields and ensure the dates are valid.");
      return;
    }
    // Create the query string manually
    const queryString = new URLSearchParams({
      carId: carId.toString(),
      carName: carName,
      startDate,
      endDate,
      totalCost: totalCost.toString(),
    }).toString();
  
    // Redirect user to the 'Book' page with query params
    router.push(`/book?${queryString}`);
  };
  
  return (
    <>
      <div className="flex items-center">
        <p className="text-2xl font-semibold">${carPrice}</p>
        <p className="text-black text-md ml-1">/ day</p>
      </div>
      <p className="text-lg text-gray-700 py-2">{carDetails.shortDescription}</p>
      
      <ul className="grid grid-cols-2 gap-4 text-gray-600">
        <li className="flex items-center">
          <FontAwesomeIcon icon={faDoorOpen} className="h-5 w-5 text-gray-500 mr-2" />
          {carDetails.numDoors} doors
        </li>
        <li className="flex items-center">
          <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-500 mr-2" />
          {carDetails.numSeats} seats
        </li>
        <li className="flex items-center">
          <FontAwesomeIcon icon={faGasPump} className="h-5 w-5 text-gray-500 mr-2" />
          {carDetails.mpg} MPG
        </li>
        <li className="flex items-center">
          <FontAwesomeIcon icon={faGasPump} className="h-5 w-5 text-gray-500 mr-2" />
          {carDetails.gasType}
        </li>
      </ul>

      {/* Start Date */}
      <div className="mt-6">
        <label className="block text-gray-700">Start Date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* End Date */}
      <div className="mt-4">
        <label className="block text-gray-700">End Date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full mt-2 border border-gray-300 rounded-lg px-4 py-2"
        />
      </div>

      {/* Display Total Cost */}
      {totalCost !== null && (
        <div className="mt-4 text-lg font-semibold">
            <hr className="border-gray-300 my-4" />
          Total before taxes: ${totalCost}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="mt-2 text-red-600 text-sm">
          {errorMessage}
        </div>
      )}

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
      >
        
        Book Now
      </button>
    </>
  );
};

export default BookingCard;
