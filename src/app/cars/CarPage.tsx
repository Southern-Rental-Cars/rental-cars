'use client';

import { useState, useEffect, useRef } from 'react';
import CarsGrid from '@/components/CarsGrid';
import Filter from '@/components/Filter';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

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

interface CarPageLayoutProps {
  cars: Car[];
}

export default function CarPageLayout({ cars }: CarPageLayoutProps) {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([22, 95]);
  const [types, setTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<string>('default');

  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 767px)');

  // Filtered cars based on price range and types
  let filteredCars = cars.filter((car) => {
    const priceMatches = car.price >= priceRange[0] && car.price <= priceRange[1];
    const typeMatches = types.length === 0 || types.includes(car.type);
    return priceMatches && typeMatches;
  });

  // Sorting logic for filtered cars
  if (sort === 'lowToHigh') {
    filteredCars = filteredCars.sort((a, b) => a.price - b.price);
  } else if (sort === 'highToLow') {
    filteredCars = filteredCars.sort((a, b) => b.price - a.price);
  }

  // Toggle filter modal and handle scroll lock
  useEffect(() => {
    if (isFilterOpen) {
      document.body.classList.add('no-scroll');
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setIsFilterOpen(false);
    }
  };

  // Handle filter changes from the Filter component
  const handleFilterChange = (
    minPrice: number,
    maxPrice: number,
    selectedTypes: string[],
    sortBy: string
  ) => {
    setPriceRange([minPrice, maxPrice]);
    setTypes(selectedTypes);
    setSort(sortBy);
  };

  // Handle filter reset
  const resetFilters = () => {
    setPriceRange([22, 95]);
    setTypes([]);
    setSort('default');
  };

  // Toggle filter modal
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        {/* Show Filter Button for Mobile */}
        {isMobile && (
          <div className="px-3">
            <div className="mb-4 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
                />
              </svg>
              <button
                className="text-lg text-gray-600 font-semibold"
                onClick={toggleFilter}
              >
                {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>
        )}

        <div className="flex items-start gap-8">
          {/* Sidebar Filter for Desktop */}
          {!isMobile && (
            <aside className="w-64 self-start">
              <Filter
                onFilterChange={handleFilterChange}
                initialPriceRange={priceRange}
                cars={cars}
                selectedTypes={types}
                selectedSort={sort}
                resetFilters={resetFilters}
              />
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">Cars Available</h2>
              <span className="text-gray-600">{filteredCars.length} Results</span>
            </div>
            <CarsGrid cars={filteredCars} />
          </main>
        </div>

        {/* Mobile Filter Modal */}
        {isMobile && (
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="fixed inset-0 bg-black z-40"
                  onClick={toggleFilter}
                />
                <motion.div
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '100%' }}
                  transition={{ ease: 'easeOut', duration: 0.3 }}
                  className="fixed bottom-0 left-0 right-0 z-50"
                >
                  <div
                    ref={modalRef}
                    className="bg-white rounded-t-lg p-6 shadow-lg relative max-h-[60vh] overflow-y-auto"
                  >
                    <button
                      onClick={toggleFilter}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    >
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <Filter
                      onFilterChange={handleFilterChange}
                      initialPriceRange={priceRange}
                      cars={cars}
                      selectedTypes={types}
                      selectedSort={sort}
                      resetFilters={resetFilters}
                    />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
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
