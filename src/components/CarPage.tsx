'use client';

import { useState, useEffect } from 'react';
import CarsGrid from '@/components/CarsGrid';
import Filter from '@/components/Filter';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Modal from '@/components/Filter/Modal';
import Toggle from './Filter/Toggle';

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

interface CarPageProps {
  cars: Car[];
}

export default function CarPage({ cars }: CarPageProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([22, 95]);
  const [types, setTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<string>('default');
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Manage scroll lock
  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isFilterOpen]);

  const handleFilterChange = (
    minPrice: number,
    maxPrice: number,
    selectedTypes: string[],
    sortBy: string
  ) => {
    setPriceRange([minPrice, maxPrice]);
    setTypes(selectedTypes);
    setSort(sortBy);  // Save the sort state
  };

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        {isMobile && (
          <Toggle isFilterOpen={isFilterOpen} toggleFilter={toggleFilter} />
        )}

        <div className="flex items-start gap-8">
          {/* Sidebar Filter for Desktop */}
          {!isMobile && (
            <aside className="w-64 self-start">
              <Filter
                onFilterChange={handleFilterChange}
                initialPriceRange={priceRange}
                types={types}
                sort={sort}  // Pass the sort state to Filter
                cars={cars}
              />
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Cars Available</h2>
            </div>
            {/* Pass filter inputs to CarsGrid */}
            <CarsGrid
              cars={cars}
              types={types}
              priceRange={priceRange}
              sort={sort}  // Pass the sort state to CarsGrid
            />
          </main>
        </div>

        {/* Mobile Filter Modal */}
        {isMobile && (
          <Modal
            isFilterOpen={isFilterOpen}
            toggleFilter={toggleFilter}
            handleFilterChange={handleFilterChange}
            priceRange={priceRange}
            types={types}
            sort={sort}  // Pass the sort state to the modal
            cars={cars}
          />
        )}
      </div>

      <style jsx global>{`
        .no-scroll {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
