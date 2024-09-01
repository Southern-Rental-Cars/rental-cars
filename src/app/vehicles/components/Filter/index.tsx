import { useState, useEffect } from 'react';
import PriceRangeSlider from './PriceRange';
import Type from './Type';
import SortBy from './Sort';
import {CarFilterProps} from '@/app/vehicles/types';

export default function Filter({ onFilterChange, initialPriceRange, cars, sort, types }: CarFilterProps) {
  const [selectedMinPrice, setSelectedMinPrice] = useState(initialPriceRange[0]);
  const [selectedMaxPrice, setSelectedMaxPrice] = useState(initialPriceRange[1]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(types);
  const [selectedSort, setSelectedSort] = useState<string>(sort);
  const [resetFilter, setResetFilter] = useState(false);

  // Function to reset all filters to default values
  const resetFilters = () => {
    setSelectedMinPrice(22);
    setSelectedMaxPrice(95);
    setSelectedTypes([]);
    setSelectedSort('default');
    setResetFilter(true); // Trigger to reset filters
  };

  // Sync state changes with parent through onFilterChange
  useEffect(() => {
    if (!resetFilter) {
      onFilterChange(selectedMinPrice, selectedMaxPrice, selectedTypes, selectedSort);
    }
  }, [selectedMinPrice, selectedMaxPrice, selectedTypes, selectedSort]);

  useEffect(() => {
    if (resetFilter) {
      setResetFilter(false); // Reset the trigger after the effect runs
      onFilterChange(22, 95, [], 'default'); // Reset to default values
    }
  }, [resetFilter]);

  // Handle changes to the price range slider
  const handlePriceChange = (newMinPrice: number, newMaxPrice: number) => {
    setSelectedMinPrice(newMinPrice);
    setSelectedMaxPrice(newMaxPrice);
  };

  const handleTypeChange = (types: string[]) => {
    setSelectedTypes(types);
  };

  const handleSortChange = (option: string) => {
    setSelectedSort(option);
  };

  return (
    <div className="mt-5">
      <Type 
        cars={cars} 
        onCarClassChange={handleTypeChange} 
        selectedTypes={selectedTypes} 
      />

      <PriceRangeSlider 
        minPrice={selectedMinPrice} 
        maxPrice={selectedMaxPrice} 
        onPriceChange={handlePriceChange}
      />

      <SortBy 
        onSortChange={handleSortChange} 
        selectedSort={selectedSort} 
      />

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
