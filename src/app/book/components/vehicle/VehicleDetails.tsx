import React from 'react';
import Image from 'next/image';
import { Vehicle, CarImage } from '@/types'; // Ensure you have the right types

interface VehicleDetailsProps {
  vehicle: Vehicle & { carImages: CarImage[] }; // Include carImages in the type
  onBack: () => void;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ vehicle, onBack }) => {
  return (
    <div className="max-w-4xl w-full p-6 bg-white rounded-lg shadow-lg">
      <button onClick={onBack} className="mb-4 text-blue-500">Back to Vehicles</button>
      
      <h1 className="text-3xl font-bold mb-4">{vehicle.year} {vehicle.make} {vehicle.model}</h1>

      {/* Display Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {vehicle.carImages.map((image) => (
          <div key={image.id} className="relative h-64 w-full">
            <Image
              src={image.image_url}
              alt={`Image of ${vehicle.make} ${vehicle.model}`}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-lg"
            />
          </div>
        ))}
      </div>

      {/* Vehicle Details */}
      <p className="text-lg mb-2">{vehicle.long_description}</p>
      <p className="text-md text-gray-600">Gas Type: {vehicle.gas_type}</p>
      <p className="text-md text-gray-600">Seats: {vehicle.num_seats}</p>
      <p className="text-md text-gray-600">Doors: {vehicle.num_doors}</p>
      <p className="text-md text-gray-600">MPG: {vehicle.mpg}</p>

      {/* Vehicle Features */}
      <h2 className="text-xl font-bold mt-6">Features:</h2>
      <p>{vehicle.features}</p>

      {/* Vehicle FAQs */}
      {vehicle.faqs && (
        <div className="mt-6">
          <h2 className="text-xl font-bold">FAQs:</h2>
          <ul>
            {vehicle.faqs.map((faq, index) => (
              <li key={index} className="mb-2">
                <strong>Q: {faq.question}</strong>
                <p>A: {faq.answer}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default VehicleDetails;
