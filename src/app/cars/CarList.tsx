'use client'; // Mark as a Client Component

import { Card } from '@/components/Card';
import Image from 'next/image';

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
}

interface CarListProps {
  cars: Car[];
}

export default function CarList({ cars }: CarListProps) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {cars.map((car, i) => (
        <Card key={i} className="overflow-hidden rounded-xl shadow-md">
          <div className="relative h-48 w-full">
            <Image
              src={car.image_url}
              alt={`${car.make} ${car.model}`}
              layout="fill" // This makes the image fill the parent container
              objectFit="cover" // This ensures the image covers the container without distortion
              className="rounded-t-xl"
            />
          </div>
          <div className="flex flex-1 flex-col justify-between p-6">
            <h2 className="mb-2 text-lg font-semibold">
              {`${car.make} ${car.model} ${car.year}`}
            </h2>
            <p className="mb-4 text-gray-600">{car.short_description}</p>
            <p className="mb-4 text-gray-600">${car.price} / day</p>
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
  );
}
