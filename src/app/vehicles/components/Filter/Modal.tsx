'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CarsFilter from '@/app/vehicles/components/Filter';  // Import Filter from the appropriate path
import { ModalProps } from '@/app/vehicles/types';

export default function Modal({isFilterOpen, toggleFilter, handleFilterChange, priceRange, cars, sort, types}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
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
              <CarsFilter
                onFilterChange={handleFilterChange}
                initialPriceRange={priceRange}
                types={types}
                sort={sort}  // Pass the sort state to Filter
                cars={cars}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
