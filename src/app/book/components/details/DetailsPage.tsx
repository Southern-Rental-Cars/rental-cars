import React, { useState } from 'react';
import Image from 'next/image';
import { Vehicle, VehicleImage } from '@/types';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import { format, differenceInDays } from 'date-fns';

interface DetailsProps {
  vehicle: Vehicle & { vehicleImages: VehicleImage[] };
  startDateTime: string;
  endDateTime: string;
  onBack: () => void;
  onProceedToPayment: () => void;
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

  const handleNextImage = () => setActiveImageIndex((prev) => (prev + 1) % vehicle.vehicleImages.length);
  const handlePrevImage = () => setActiveImageIndex((prev) => (prev === 0 ? vehicle.vehicleImages.length - 1 : prev - 1));

  const handleImageClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const toggleShowAllFeatures = () => setShowAllFeatures(!showAllFeatures);

  return (
    <div className="max-w-7xl w-full mx-auto p-6 bg-white rounded-lg mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Left Column: Vehicle Image and Vehicle Information */}
      <div className="space-y-4">
        {/* Vehicle Image Section */}
        <div className="relative w-full h-[350px] lg:h-[450px] rounded-lg overflow-hidden">
          <Image
            src={vehicle.vehicleImages[activeImageIndex].image_url}
            alt={`Image of ${vehicle.make} ${vehicle.model}`}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg cursor-pointer"
            onClick={handleImageClick}
          />
          {vehicle.vehicleImages.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-gray-700 transition"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-gray-700 transition"
              >
                <FaArrowRight />
              </button>
            </>
          )}
          {/* Overlay Vehicle Info */}
          <div className="absolute bottom-0 left-0 w-full p-4 bg-black bg-opacity-60 text-white rounded-b-lg">
            <h2 className="text-lg font-bold">{vehicle.year} {vehicle.make} {vehicle.model} </h2>
          </div>
        </div>

        {/* Vehicle Information Card */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Vehicle Information</h3>
          <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-700">
            <p><strong>Type:</strong> {vehicle.gas_type || 'N/A'}</p>
            <p><strong>Seats:</strong> {vehicle.num_seats || 'N/A'}</p>
            <p><strong>Doors:</strong> {vehicle.num_doors || 'N/A'}</p>
            <p><strong>MPG:</strong> {vehicle.mpg || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Right Column: Information Card and Booking Details */}
      <div className="space-y-4">
        {/* Information Card: Features, Guidelines, FAQs */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Features</h3>
            <ul className="text-sm list-disc pl-5">
              {vehicle.features?.split(',').slice(0, showAllFeatures ? vehicle.features.length : 3).map((feature, index) => (
                <li key={index}>{feature.trim()}</li>
              ))}
            </ul>
            {vehicle.features && vehicle.features.split(',').length > 3 && (
              <button onClick={toggleShowAllFeatures} className="text-blue-600 text-sm mt-2">
                {showAllFeatures ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold">Guidelines</h3>
            <p className="text-sm">{vehicle.guidelines || 'N/A'}</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">FAQs</h3>
            <ul className="text-sm list-none space-y-2">
              {vehicle.faqs && vehicle.faqs.map((faq: { question: string, answer: string }, index: number) => (
                <li key={index}>
                  <p className="font-semibold">{faq.question}</p>
                  <p>{faq.answer}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white border border-gray-200 p-4 rounded-lg">
          <h2 className="text-lg font-semibold">Booking Details</h2>
          <p className="text-sm text-gray-700">From: {formattedStartDate}</p>
          <p className="text-sm text-gray-700">To: {formattedEndDate}</p>
          <p className="text-sm text-gray-700">Daily rate: ${vehicle.price}</p>
          <div className="mt-2 flex justify-between">
            <p className="font-semibold text-lg">Subtotal:</p>
            <p className="font-semibold text-lg">${totalCost.toFixed(2)}</p>
          </div>
        </div>

        {/* Proceed Button */}
        <button onClick={onProceedToPayment} className="w-full bg-blue-600 text-white py-2 rounded-lg text-center font-semibold hover:bg-blue-700 transition">
          Proceed to checkout
        </button>
      </div>

      {/* Modal for Image Preview */}
      {isModalOpen && (
        <div onClick={handleCloseModal} className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="relative w-full h-full max-w-4xl max-h-full flex items-center" onClick={(e) => e.stopPropagation()}>
            <Image
              src={vehicle.vehicleImages[activeImageIndex].image_url}
              alt={`Full view of ${vehicle.make} ${vehicle.model}`}
              fill
              style={{ objectFit: 'contain' }}
            />
            <button
              onClick={handleCloseModal}
              className="absolute top-6 right-6 text-white text-3xl hover:text-gray-400 transition"
            >
              <FaTimes />
            </button>
            {vehicle.vehicleImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-400 transition"
                >
                  <FaArrowLeft />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-4xl hover:text-gray-400 transition"
                >
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
