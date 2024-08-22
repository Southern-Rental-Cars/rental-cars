import { Card } from '@/components/Card';
import Image from 'next/image';
import React from 'react';

interface Car {
  car_name: string;
  short_description: string;
  image_url: string;
  turo_url: string;
  make: string;
  model: string;
  year: BigInteger;
  type: string;
  price: number;
  num_seats: number;
  num_doors: number;
}

interface CarListProps {
  cars: Car[];
}

const CarsGrid = React.memo(function CarsGrid({ cars }: CarListProps) {
  return (
    <div>
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-6">
        {cars.map((car, i) => (
          <Card key={i} className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <div className="relative h-48 w-full">
              <Image
                src={car.image_url}
                alt={`${car.make} ${car.model}`}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-t-xl"
                priority
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <h2 className="mb-2 text-lg font-semibold">
                {`${car.make} ${car.model} ${car.year}`}
              </h2>
              <p className="mb-4 text-gray-600">{car.short_description}</p>
              <a
                href={car.turo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-md bg-sky-500 py-2 text-center text-white hover:bg-sky-600"
              >
                Check Availability
              </a>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
});

export default CarsGrid;
