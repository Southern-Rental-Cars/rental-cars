import { Card } from '@/app/cars/components/Card';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { CarGridProps } from "@/app/cars/types";

const Grid = React.memo(function Grid({cars, types, priceRange, sort}: CarGridProps) {
  
  // Filtering Logic
  let filteredCars = cars.filter((car) => {
    const priceMatches = car.price >= priceRange[0] && car.price <= priceRange[1];
    const typeMatches = types.length === 0 || types.includes(car.type);
    return priceMatches && typeMatches;
  });
console.log(filteredCars);
  // Sorting Logic
  if (sort === 'lowToHigh') {
    filteredCars = filteredCars.sort((a, b) => a.price - b.price);
  } else if (sort === 'highToLow') {
    filteredCars = filteredCars.sort((a, b) => b.price - a.price);
  }

  return (
    <div>

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-6">
        {filteredCars.map((car, i) => (
          <Link
            href={{
              pathname: `/cars/${car.id}`, 
            }}
            key={i}
          >
            <Card className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full">
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
                <p className="mb-4 text-gray-600 flex-grow">{car.short_description}</p>
                <span className="block w-full rounded-md bg-sky-500 py-2 text-center text-white hover:bg-sky-600 mt-auto">
                  View Details
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>

    </div>
  );

});

export default Grid;
