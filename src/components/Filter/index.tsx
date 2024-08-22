import { useState, useEffect } from 'react';
import Slider from './Slider';
import Type from './Type';
import SortBy from './Sort';

interface Car {
  type: string;
}

interface FilterProps {
  onFilterChange: (minPrice: number, maxPrice: number, types: string[], sortBy: string) => void;
  initialPriceRange: [number, number];
  cars: Car[];
  selectedTypes: string[];
  selectedSort: string;
  resetFilters: () => void;
}

export default function Filter({
  onFilterChange,
  initialPriceRange,
  cars,
  selectedTypes,
  selectedSort,
  resetFilters,
}: FilterProps) {
  const [minPrice, setMinPrice] = useState(initialPriceRange[0]);
  const [maxPrice, setMaxPrice] = useState(initialPriceRange[1]);
  const [resetFilter, setResetFilter] = useState(false);

  // Avoid infinite loop by controlling when onFilterChange is called
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(minPrice, maxPrice, selectedTypes, selectedSort);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [minPrice, maxPrice, selectedTypes, selectedSort, onFilterChange]);

  const handleTypeChange = (types: string[]) => {
    setResetFilter(false);
    onFilterChange(minPrice, maxPrice, types, selectedSort);
  };

  const handleSortChange = (option: string) => {
    onFilterChange(minPrice, maxPrice, selectedTypes, option);
  };

  return (
    <div className="mt-5">
      {/* Type Filter */}
      <Type 
        cars={cars} 
        onCarClassChange={handleTypeChange} 
        resetFilter={resetFilter} 
        selectedTypes={selectedTypes} 
      />

      {/* Price Range Slider */}
      <Slider 
        minPrice={minPrice} 
        maxPrice={maxPrice} 
        onMinPriceChange={setMinPrice} 
        onMaxPriceChange={setMaxPrice} 
      />

      {/* Sort By Filter */}
      <SortBy 
        onSortChange={handleSortChange} 
        selectedSort={selectedSort} 
      />

      {/* Reset Button */}
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-semibold rounded"
          onClick={() => {
            resetFilters();
            setResetFilter(true); // Trigger the reset for the filters
            setMinPrice(initialPriceRange[0]); // Reset price range to initial values
            setMaxPrice(initialPriceRange[1]);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
