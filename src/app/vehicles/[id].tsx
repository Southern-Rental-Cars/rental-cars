'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Container } from '@/components/Container';
import Vehicle from '@/lib/vehicle'

const VehicleDetailPage = ({ vehicle }: { vehicle: Vehicle }) => {
  const [showDescription, setShowDescription] = useState(false);

  return (
    <Container className="mt-9">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative h-80 md:h-full">
          <Image
            src={vehicle.image_url}
            alt={vehicle.car_name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {vehicle.car_name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {vehicle.short_description}
          </p>
          
          <button
            onClick={() => setShowDescription(!showDescription)}
            className="text-blue-500 hover:underline mb-4"
          >
            {showDescription ? 'Hide Description' : 'Read More'}
          </button>

          {showDescription && (
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {vehicle.short_description}
            </p>
          )}

          <a
            href={vehicle.turo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-sky-500 text-white text-center py-2 rounded-md hover:bg-sky-600"
          >
            Check Availability
          </a>
        </div>
      </div>
    </Container>
  );
};

export default VehicleDetailPage;
