import { useState, useEffect } from 'react';
import './Filter.css';

interface FilterProps {
  onFilterChange: (minPrice: number, maxPrice: number) => void;
  initialPriceRange: [number, number]; // Preload filter values
}

export default function Filter({ onFilterChange, initialPriceRange }: FilterProps) {
  const [minPrice, setMinPrice] = useState(initialPriceRange[0]);
  const [maxPrice, setMaxPrice] = useState(initialPriceRange[1]);

  // Whenever the initialPriceRange prop changes, update the state
  useEffect(() => {
    setMinPrice(initialPriceRange[0]);
    setMaxPrice(initialPriceRange[1]);
  }, [initialPriceRange]);

  // Ensure minPrice doesn't go below the minimum or exceed maxPrice
  const handleMinPriceChange = (value: number) => {
    const parsedValue = Math.min(Math.max(value, 22), maxPrice - 1);
    setMinPrice(parsedValue);
  };

  // Ensure maxPrice doesn't go above the maximum or fall below minPrice
  const handleMaxPriceChange = (value: number) => {
    const parsedValue = Math.max(Math.min(value, 95), minPrice + 1);
    setMaxPrice(parsedValue);
  };

  const handleFilterChange = () => {
    onFilterChange(minPrice, maxPrice);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Price Range</h2>
      <div className="slider-container mb-4">
        {/* Range input sliders */}
        <input
          type="range"
          min={22}
          max={95}
          value={minPrice}
          onChange={(e) => handleMinPriceChange(Number(e.target.value))}
          className="range-thumb left-thumb"
        />
        <input
          type="range"
          min={22}
          max={95}
          value={maxPrice}
          onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
          className="range-thumb right-thumb"
        />

        {/* Track */}
        <div className="slider-track" />
        <div
          className="slider-range"
          style={{
            left: `${((minPrice - 22) / (95 - 22)) * 100}%`,
            right: `${100 - ((maxPrice - 22) / (95 - 22)) * 100}%`,
          }}
        />

        {/* Price labels */}
        <div className="price-labels">
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
        </div>
      </div>

      {/* Number input boxes with up/down arrows */}
      <div className="flex justify-between mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Minimum Price</label>
          <input
            type="number"
            min={22}
            max={maxPrice - 1}
            value={minPrice}
            onChange={(e) => handleMinPriceChange(Number(e.target.value))}
            className="block w-full p-2 border rounded-md text-center"
            step="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Maximum Price</label>
          <input
            type="number"
            min={minPrice + 1}
            max={95}
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
            className="block w-full p-2 border rounded-md text-center"
            step="1"
          />
        </div>
      </div>

      <button
        onClick={handleFilterChange}
        className="block w-full bg-blue-600 text-white py-2 rounded-md"
      >
        Apply Filters
      </button>
    </div>
  );
}
