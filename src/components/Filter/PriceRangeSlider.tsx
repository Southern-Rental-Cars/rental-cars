import { useState, useEffect } from 'react';
import './PriceRangeSlider.css'; // Slider-specific CSS

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}

export default function PriceRangeSlider({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceRangeSliderProps) {

  // Ensure minPrice doesn't go below the minimum or exceed maxPrice
  const handleMinPriceChange = (value: number) => {
    if (value >= 22 && value < maxPrice) {
      onMinPriceChange(value);
    }
  };

  // Ensure maxPrice doesn't go above the maximum or fall below minPrice
  const handleMaxPriceChange = (value: number) => {
    if (value <= 95 && value > minPrice) {
      onMaxPriceChange(value);
    }
  };

  return (
    <div className="price-range-slider">
      <h2 className="text-sm text-gray-600">Price Range</h2>
      <div className="slider-container">
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
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={22}
            max={maxPrice - 1}
            value={minPrice}
            onChange={(e) => handleMinPriceChange(Number(e.target.value))}
            className="block w-24 p-2 border rounded-md"
            step="1"
          />
        </div>
        <div>
          <input
            type="number"
            inputMode="numeric"
            pattern="[0-9]*"
            min={minPrice + 1}
            max={95}
            value={maxPrice}
            onChange={(e) => handleMaxPriceChange(Number(e.target.value))}
            className="block w-24 p-2 border rounded-md"
            step="1"
          />
        </div>
      </div>
    </div>
  );
}
