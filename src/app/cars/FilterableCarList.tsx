'use client';

import { useState, useEffect, useRef } from 'react';
import CarList from './CarList';
import Filter from '@/components/Filter/Filter';
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
  const [priceRange, setPriceRange] = useState<[number, number]>([22, 95]);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [type, setType] = useState('');
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

  // Function to update the filters when the user clicks "Apply"
  const handleFilterChange = (minPrice: number, maxPrice: number, selectedMake: string, selectedModel: string, selectedType: string) => {
    setPriceRange([minPrice, maxPrice]);
    setMake(selectedMake);
    setModel(selectedModel);
    setType(selectedType);
    setIsFilterOpen(false);
  };

  const filteredCars = cars.filter((car) => {
    const priceMatches = car.price >= priceRange[0] && car.price <= priceRange[1];
    const makeMatches = make === '' || car.make === make;
    const modelMatches = model === '' || car.model === model;
    const typeMatches = type === '' || car.type === type;

    return priceMatches && makeMatches && modelMatches && typeMatches;
  });

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar Filter for Desktop */}
      {!isMobile && (
        <aside className="w-1/4 p-4">
          <Filter
            onFilterChange={handleFilterChange}
            initialPriceRange={priceRange}
            cars={cars}
          />
        </aside>
      )}

      {/* Car List */}
      <main className="flex-1 p-4">
        {filteredCars.length > 0 ? (
          <CarList cars={filteredCars} />
        ) : (
          <p>No cars available with the selected filters.</p>
        )}
      </main>

      {/* Filter Modal for Mobile */}
      {isMobile && (
        <>
          <button
            className="fixed bottom-4 right-4 bg-blue-600 text-white py-2 px-4 rounded-full"
            onClick={() => setIsFilterOpen(true)}
          >
            Filter
          </button>
          <Modal
            isOpen={isFilterOpen}
            onRequestClose={() => setIsFilterOpen(false)}
            className="fixed inset-0 flex items-center justify-center lg:hidden"
            overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            ariaHideApp={false}
          >
            <div
              ref={modalRef}
              className="bg-white rounded-lg p-6 w-fit max-w-lg mx-auto"
              style={{ maxHeight: '80vh', overflow: 'hidden' }}
            >
              <Filter
                onFilterChange={handleFilterChange}
                initialPriceRange={priceRange}
                cars={cars}
              />
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}
