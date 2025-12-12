import { Card } from '@/app/vehicles/components/Card';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { CarGridProps } from "@/app/vehicles/types";

const Grid = React.memo(function Grid({ cars, types, priceRange, sort }: CarGridProps) {

  // Filtering Logic
  let filteredCars = cars.filter((car) => {
    const priceMatches = car.price >= priceRange[0] && car.price <= priceRange[1];
    const typeMatches = types.length === 0 || types.includes(car.type);
    return priceMatches && typeMatches;
  });

  // Sorting Logic
  if (sort === 'lowToHigh') {
    filteredCars = filteredCars.sort((a, b) => a.price - b.price);
  } else if (sort === 'highToLow') {
    filteredCars = filteredCars.sort((a, b) => b.price - a.price);
  }

  return (
    <>
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-6">
        {filteredCars.map((car, i) => (
          <Link
            href={{
              pathname: `/vehicles/${car.id}`,
            }}
            key={i}
          >
            <Card className="group relative flex flex-col h-full rounded-2xl bg-white border border-zinc-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={car.image_url}
                  alt={`${car.make} ${car.model}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-500 group-hover:scale-105" // Zoom effect
                />
                {/* Optional: Add a price tag overlay */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-navy-900 shadow-sm">
                  ${car.price}/day
                </div>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-gold-500">
                  {car.type}
                </div>
                <h2 className="text-xl font-serif font-bold text-navy-900 mb-2">
                  {car.make} {car.model} <span className="font-sans font-normal text-zinc-500 text-base">{car.year}</span>
                </h2>
                <p className="line-clamp-2 text-sm text-zinc-600 mb-6 flex-grow">
                  {car.short_description}
                </p>
                <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700">
                  View Details <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );

});

export default Grid;
