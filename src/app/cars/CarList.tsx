'use client';

import { useState, useMemo } from 'react';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
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
}

interface CarListProps {
  cars: Car[];
}

export default function CarList({ cars }: CarListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCars = useMemo(() => {
    return cars.filter((car) =>
      `${car.make} ${car.model} ${car.year} ${car.type}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, cars]);

  return (
    <>
      <div className="relative">
        <input
          type="text"
          placeholder="Search for a make/model or year"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full py-3 px-4 pr-12 rounded-full border-gray-300 focus:outline-none focus:border-sky-500"
        />
        <button className="absolute inset-y-0 right-0 flex items-center px-4 rounded-r-full bg-sky-500 text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
        </button>
      </div>

      <Container className="mb-12 mt-12">
        <ul
          role="list"
          className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filteredCars.map((car, i) => (
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
        </ul>
      </Container>
    </>
  );
}
