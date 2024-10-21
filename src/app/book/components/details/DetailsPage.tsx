import React, { useState } from 'react';
import Image from 'next/image';
import { Vehicle, CarImage } from '@/types';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import { format, differenceInDays } from 'date-fns';

interface DetailsProps {
  vehicle: Vehicle & { carImages: CarImage[] };
  startDateTime: string;
  endDateTime: string;
  onBack: () => void;
  onProceedToPayment: () => void; // Call this to navigate to payment
}

const Details: React.FC<DetailsProps> = ({ vehicle, onBack, startDateTime, endDateTime, onProceedToPayment }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);
  const rentalDays = differenceInDays(endDate, startDate) + 1;
  const totalCost = vehicle.price * rentalDays;
  const formattedStartDate = format(startDate, 'EEE MMM do, hh:mm a');
  const formattedEndDate = format(endDate, 'EEE MMM do, hh:mm a');

  const handleNextImage = () => setActiveImageIndex((prev) => (prev + 1) % vehicle.carImages.length);
  const handlePrevImage = () => setActiveImageIndex((prev) => (prev === 0 ? vehicle.carImages.length - 1 : prev - 1));
  const handleImageClick = (index: number) => {
    setActiveImageIndex(index);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleShowAllFeatures = () => setShowAllFeatures(!showAllFeatures);

  return (
    <div className="max-w-7xl w-full mx-auto p-6 bg-white rounded-lg mt-8">
      <button onClick={onBack} className="mb-6 text-blue-500 hover:text-blue-700 transition duration-200 text-lg font-medium">
        ← Back
      </button>

      {/* Two-column layout: Image with Vehicle Details on the left, Booking Details on the right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section with Vehicle Details */}
        <div className="relative w-full h-[350px] lg:h-[450px] rounded-lg overflow-hidden group">
          <Image
            src={vehicle.vehicleImages[activeImageIndex].image_url}
            alt={`Image of ${vehicle.make} ${vehicle.model}`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
            onClick={() => handleImageClick(activeImageIndex)}
          />
          {vehicle.vehicleImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2"
              >
                <FaArrowRight />
              </button>
            </>
          )}

          {/* Vehicle Details */}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-black bg-opacity-60 backdrop-blur-sm text-white rounded-b-lg">
            <h2 className="text-2xl font-bold">
              {vehicle.make} {vehicle.model} {vehicle.year}
            </h2>
            <div className="grid grid-cols-2 text-sm mt-2">
              <p>
                <span className="font-semibold">Type:</span> {vehicle.gas_type}
              </p>
              <p>
                <span className="font-semibold">Seats:</span> {vehicle.num_seats}
              </p>
              <p>
                <span className="font-semibold">Doors:</span> {vehicle.num_doors}
              </p>
              <p>
                <span className="font-semibold">MPG:</span> {vehicle.mpg}
              </p>
            </div>
          </div>

          {/* Features - Hover to Show */}
          <div className="absolute inset-0 p-6 bg-black bg-opacity-60 backdrop-blur-sm text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
            <h3 className="text-lg font-semibold">Features:</h3>
            <ul className="list-disc pl-5 text-sm">
              {vehicle.features.split(',').slice(0, showAllFeatures ? vehicle.features.length : 3).map((feature, index) => (
                <li key={index}>{feature.trim()}</li>
              ))}
            </ul>
            {vehicle.features.split(',').length > 3 && (
              <button onClick={toggleShowAllFeatures} className="mt-2 text-sm text-yellow-300 hover:text-yellow-500 transition duration-200">
                {showAllFeatures ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>
        {/* Booking Details */}
        <div className="bg-white border border-gray-200 p-6 rounded-lg space-y-3">
          <h2 className="text-2xl font-bold">Booking details</h2>
          <div className="border-t border-gray-300 mt-3" />
          <div className="mt-3">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">From:</span> {formattedStartDate}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">To:</span> {formattedEndDate}
            </p>
          </div>
          {/* Pricing */}
          <div className="border-t border-gray-300 mt-3" />
          <div className="mt-3">
            <div className="text-lg text-gray-700 space-y-3">
              <div className="flex justify-between">
                <p className='text-md'>Daily rate:</p>
                <p>${vehicle.price.toFixed(2)} / day</p>
              </div>
              <div className="border-t border-gray-300 space-y-3" />
              <div className="flex justify-between">
                <p className="font-bold text-md">Subtotal:</p>
                <p className="font-bold text-2xl">${totalCost.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proceed */}
      <div className="mt-10 text-center">
        <button onClick={onProceedToPayment} className="px-6 py-3 bg-blue-600 text-white rounded-full text-lg font-medium hover:bg-blue-700 transition duration-200 shadow-lg">
          Proceed to checkout
        </button>
      </div>

      {/* Full-screen Image Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative w-full h-full max-w-4xl max-h-full flex items-center">
            <Image src={vehicle.carImages[activeImageIndex].image_url} alt={`Full view of ${vehicle.make} ${vehicle.model}`} fill style={{ objectFit: 'contain' }} />
            <button onClick={handleCloseModal} className="absolute top-4 right-4 text-white text-3xl">
              <FaTimes />
            </button>
            {vehicle.carImages.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-4xl">
                  <FaArrowLeft />
                </button>
                <button onClick={handleNextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-4xl">
                  <FaArrowRight />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Details;
