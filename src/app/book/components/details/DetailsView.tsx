'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Vehicle, VehicleImages } from '@/types';
import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import { format, differenceInDays } from 'date-fns';

interface DetailsViewProps {
  vehicle: Vehicle;
  images: VehicleImages[];
  startDateTime: string;
  endDateTime: string;
  onProceedToPayment: () => void;
  onBack: () => void;
}

const DetailsView: React.FC<DetailsViewProps> = ({ vehicle, images, startDateTime, endDateTime, onBack, onProceedToPayment }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Date and pricing calculations
  const startDate = new Date(startDateTime);
  const endDate = new Date(endDateTime);
  const days = differenceInDays(endDate, startDate) + 1;
  const subtotal = vehicle.price * days;
  const tax = subtotal * 0.0825;
  const totalPrice = subtotal + tax;
  const formattedStartDate = format(startDate, 'EEE MMM do, hh:mm a');
  const formattedEndDate = format(endDate, 'EEE MMM do, hh:mm a');

  const handleNextImage = () => setActiveImageIndex((prev) => (prev + 1) % images.length);
  const handlePrevImage = () => setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const toggleShowAllFeatures = () => setShowAllFeatures(!showAllFeatures);

  // Modal controls
  const openModal = (index: number) => {
    setActiveImageIndex(index);
    setIsModalOpen(true);
  }; 
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="mt-3 flex flex-col items-center p-6">
      <div className="max-w-4xl w-full space-y-8">

        {/* Back Button */}
        <button onClick={onBack} className="flex items-center text-blue-600 font-semibold mb-3">
          <FaArrowLeft className="mr-2" /> Back
        </button>

        {/* Vehicle Carousel */}
        <div className="relative w-full h-[200px] rounded-lg overflow-hidden"> {/* Reduced height */}
          <Image
            src={images[activeImageIndex].image_url}
            alt={`Image of ${vehicle.make} ${vehicle.model}`}
            layout="fill"
            objectFit="cover"
            className="rounded-lg cursor-pointer"
            onClick={() => openModal(activeImageIndex)}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-gray-700 transition"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white rounded-full p-2 hover:bg-gray-700 transition"
              >
                <FaArrowRight />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Images - Horizontal Scrollable Container */}
        <div className="overflow-x-auto w-full mt-4">
          <div className="flex space-x-2">
            {images.map((img, idx) => (
              <Image
                key={idx}
                src={img.image_url}
                alt={`Thumbnail ${idx + 1}`}
                width={60}
                height={45} // Adjusted height for a more compact display
                className={`cursor-pointer rounded-lg ${activeImageIndex === idx ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => openModal(idx)}
              />
            ))}
          </div>
        </div>

        {/* Modal for Image View */}
        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
            onClick={closeModal}
          >
            <div
              className="relative w-[90%] md:w-[60%] lg:w-[50%] h-[80%] bg-white rounded-lg overflow-hidden flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside modal
            >
              <Image
                src={images[activeImageIndex].image_url}
                alt={`Image of ${vehicle.make} ${vehicle.model}`}
                layout="fill"
                objectFit="contain"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevImage();
                }}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white rounded-full p-3 hover:bg-gray-700 transition"
              >
                <FaArrowLeft />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextImage();
                }}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-70 text-white rounded-full p-3 hover:bg-gray-700 transition"
              >
                <FaArrowRight />
              </button>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-gray-800 bg-opacity-70 text-white rounded-full p-2 hover:bg-gray-700 transition"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        )}

        {/* Information and Booking Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Vehicle Information Card */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold">{vehicle.year} {vehicle.make} {vehicle.model}</h2>
            <div className="grid grid-cols-2 text-md text-gray-700 mt-3">
              <p><strong>Fuel Type:</strong> {vehicle.gas_type || 'N/A'}</p>
              <p><strong>Seats:</strong> {vehicle.num_seats || 'N/A'}</p>
              <p><strong>Doors:</strong> {vehicle.num_doors || 'N/A'}</p>
              <p><strong>MPG:</strong> {vehicle.mpg || 'N/A'}</p>
            </div>
            <p className="mt-5 text-gray-700">{vehicle.short_description || ''}</p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg shadow-md">

            <h2 className="text-xl font-semibold mb-3">Booking Summary</h2>
            {/* Dates */}
            <div className="flex justify-between text-gray-700 text-md">
              <span> From:</span>
              <span className="font-medium">{formattedStartDate}</span>
            </div>
            <div className="flex justify-between text-gray-700 text-md">
              <span> To: </span>
              <span className="font-medium">{formattedEndDate}</span>
            </div>
            
  
            {/* Divider */}
            <hr className="my-3" />

            {/* Daily Rate */}
            <div className="flex justify-between text-gray-700 text-md">
              <span>Daily rate:</span>
              <span className="font-medium">${vehicle.price}</span>
            </div>
            
            {/* Total Days */}
            <div className="flex justify-between text-gray-700 text-md">
              <span>Rental period:</span>
              <span className="font-medium">{days} {days > 1 ? 'days' : 'day'}</span>
            </div>

            {/* Tax */}
            <div className="flex justify-between text-gray-700 text-md">
              <span>Sales tax (8.25%):</span>
              <span className="font-medium"> ${tax.toFixed(2)}</span>
            </div>

            {/* Divider */}
            <hr className="my-3" />

            {/* Total Price */}
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Total:</p>
              <p className="text-xl font-bold text-gray-800">${totalPrice.toFixed(2)}</p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onProceedToPayment}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg font-semibold flex items-center justify-center hover:bg-blue-700 transition"
            >
              Go to Checkout <FaArrowRight className="ml-2" />
            </button>
            </div>
            
          </div>

        {/* Additional Information */}
        <div className="space-y-4">

          {/* Guidelines */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold">Guidelines</h2>
            <p className="text-sm text-gray-700 mt-2">{vehicle.guidelines || 'No guidelines provided'}</p>
          </div>

          {/* Features */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold">Features</h2>
            <ul className="text-sm list-disc pl-5 mt-2">
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

          {/* FAQs */}
          <div className="bg-white border border-gray-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold">FAQs</h2>
            <ul className="text-sm space-y-2 mt-2">
              {vehicle.faqs?.map((faq, index) => (
                <li key={index}>
                  <p className="font-semibold">{faq.question}</p>
                  <p>{faq.answer}</p>
                </li>
              )) || <p>No FAQs available</p>}
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DetailsView;
