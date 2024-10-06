'use client';

import { useState, useEffect } from 'react';
import VehicleGrid from '@/app/vehicles/components/Grid';
import VehicleFilter from '@/app/vehicles/components/Filter';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import Modal from '@/app/vehicles/components/Filter/Modal';
import Toggle from './Filter/Toggle';
import { CarViewProps } from '@/types';

export default function Vehicles({ cars }: CarViewProps) {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);

  // Default values for filters
  const defaultPriceRange: [number, number] = [22, 95];
  const defaultTypes: string[] = [];
  const defaultSort: string = 'default';

  const [priceRange, setPriceRange] = useState<[number, number]>(defaultPriceRange);
  const [types, setTypes] = useState<string[]>(defaultTypes);
  const [sort, setSort] = useState<string>(defaultSort);

  // Load session storage values after component mounts
  useEffect(() => {
    const savedPriceRange = sessionStorage.getItem('priceRange');
    const savedTypes = sessionStorage.getItem('types');
    const savedSort = sessionStorage.getItem('sort');

    if (savedPriceRange) {
      setPriceRange(JSON.parse(savedPriceRange));
    }

    if (savedTypes) {
      setTypes(JSON.parse(savedTypes));
    }

    if (savedSort) {
      setSort(savedSort);
    }
  }, []);

  // Manage scroll lock for modal open/close
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

  // Save filter states to session storage whenever they change
  useEffect(() => {
    sessionStorage.setItem('priceRange', JSON.stringify(priceRange));
  }, [priceRange]);

  useEffect(() => {
    sessionStorage.setItem('types', JSON.stringify(types));
  }, [types]);

  useEffect(() => {
    sessionStorage.setItem('sort', sort);
  }, [sort]);

  const handleFilterChange = (minPrice: number, maxPrice: number, selectedTypes: string[], sortBy: string) => {
    setPriceRange([minPrice, maxPrice]);
    setTypes(selectedTypes);
    setSort(sortBy);
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
              <VehicleFilter
                onFilterChange={handleFilterChange}
                initialPriceRange={priceRange}
                types={types}
                sort={sort}
                cars={cars}
              />
            </aside>
          )}
          {/* Main Content */}
          <main className="flex-1 p-4">

            {/* Pass filter inputs to CarsGrid */}
            <VehicleGrid
              cars={cars}
              types={types}
              priceRange={priceRange}
              sort={sort}
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
            sort={sort}
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
