import { useState, useEffect } from 'react';
import {CarSortProps} from '@/app/vehicles/types';

export default function SortBy({ onSortChange, selectedSort }: CarSortProps) {
  const [selectedOption, setSelectedOption] = useState<string>(selectedSort);

  useEffect(() => {
    setSelectedOption(selectedSort); // Update local state when the prop changes
  }, [selectedSort]);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
    onSortChange(value); // Call parent function with selected sort option
  };

  return (
    <div className="mb-4">
      <label className="block text-md font-medium text-gray-700">Sort By</label>
      <div className="mt-2 space-y-2">
        {/* Default Sort Option */}
        <label className="block space-x-2">
          <input
            type="radio"
            name="sortBy"
            value="default"
            checked={selectedOption === 'default'}
            onChange={handleOptionChange}
            className="form-radio"
          />
          <span>Default</span>
        </label>

        {/* Price (low to high) Sort Option */}
        <label className="block space-x-2">
          <input
            type="radio"
            name="sortBy"
            value="lowToHigh"
            checked={selectedOption === 'lowToHigh'}
            onChange={handleOptionChange}
            className="form-radio"
          />
          <span>Price (low to high)</span>
        </label>

        {/* Price (high to low) Sort Option */}
        <label className="block space-x-2">
          <input
            type="radio"
            name="sortBy"
            value="highToLow"
            checked={selectedOption === 'highToLow'}
            onChange={handleOptionChange}
            className="form-radio"
          />
          <span>Price (high to low)</span>
        </label>
      </div>
    </div>
  );
}
