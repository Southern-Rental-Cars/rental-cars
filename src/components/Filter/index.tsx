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
}

export default function Filter({ onFilterChange, initialPriceRange, cars }: FilterProps) {
  const [minPrice, setMinPrice] = useState(initialPriceRange[0]);
  const [maxPrice, setMaxPrice] = useState(initialPriceRange[1]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<string>('default');
  const [resetFilter, setResetFilter] = useState(false);

  // Function to reset all filters to default values
  const resetFilters = () => {
    setMinPrice(22);
    setMaxPrice(95);
    setSelectedTypes([]);
    setSortOption('default');
    setResetFilter(true);

    // Call onFilterChange immediately when resetting
    onFilterChange(22, 95, [], 'default');
  };

  useEffect(() => {
    if (resetFilter) {
      setResetFilter(false); // Reset the trigger after CarClass is reset
    }
  }, [resetFilter]);

  // Avoid infinite loop by controlling when onFilterChange is called
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onFilterChange(minPrice, maxPrice, selectedTypes, sortOption);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [minPrice, maxPrice, selectedTypes, sortOption, onFilterChange]);

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
  };

  return (
    <div className="mt-5">
      {/* Class (Type) */}
      <Type cars={cars} onCarClassChange={handleTypeChange} resetFilter={resetFilter} />

      {/* Price Range Slider */}
      <Slider minPrice={minPrice} maxPrice={maxPrice} onMinPriceChange={setMinPrice} onMaxPriceChange={setMaxPrice} />

      {/* Sort By Component */}
      <SortBy onSortChange={handleSortChange} selectedSort={sortOption} />

      {/* Clear Filters Button */}
      <div className="mt-4">
        <button
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm font-semibold rounded"
          onClick={resetFilters}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
