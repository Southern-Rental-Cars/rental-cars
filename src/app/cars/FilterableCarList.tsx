'use client';

import { useState, useEffect, useRef } from 'react';
import CarList from './CarList';
import Filter from '@/components/Filter';
import Modal from 'react-modal';
import { useMediaQuery } from '@/hooks/useMediaQuery';

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

interface FilterableCarListProps {
  cars: Car[];
}

export default function FilterableCarList({ cars }: FilterableCarListProps) {
  // Initially set the range to undefined, will hold user's selected values
  const [priceRange, setPriceRange] = useState<[number, number]>([22, 95]);
  const [filterValues, setFilterValues] = useState<[number, number]>(priceRange);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    if (isFilterOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isFilterOpen]);

  // Function to update the price range after filters are applied
  const handleFilterChange = (minPrice: number, maxPrice: number) => {
    setPriceRange([minPrice, maxPrice]);
    setIsFilterOpen(false);
  };

  // On modal open, preload the filter values from the last applied values
  const handleOpenFilterModal = () => {
    setFilterValues(priceRange); // Preload last applied price range
    setIsFilterOpen(true);
  };

  // Filter cars by price range
  const filteredCars = cars.filter((car) => car.price >= priceRange[0] && car.price <= priceRange[1]);

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar Filter for Desktop */}
      {!isMobile && (
        <aside className="w-1/4 p-4">
          <Filter onFilterChange={handleFilterChange} initialPriceRange={priceRange} />
        </aside>
      )}

      {/* Car List */}
      <main className="flex-1 p-4">
        {filteredCars.length > 0 ? (
          <CarList cars={filteredCars} />
        ) : (
          <p>No cars available in this price range.</p>
        )}
      </main>

      {/* Filter Modal for Mobile */}
      {isMobile && (
        <>
          <button
            className="fixed bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-full"
            onClick={handleOpenFilterModal}
          >
            Filter
          </button>
          <Modal
            isOpen={isFilterOpen}
            onRequestClose={() => setIsFilterOpen(false)}
            className="fixed inset-0 flex items-center justify-center lg:hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
          >
            <div
              ref={modalRef}
              className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto"
              style={{ maxHeight: '80vh', overflow: 'hidden' }}
            >
              <Filter onFilterChange={handleFilterChange} initialPriceRange={filterValues} />
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
