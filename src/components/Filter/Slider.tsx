import { useEffect, useState } from 'react';
import './static/index.css'; // Slider-specific CSS

interface SliderProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (minPrice: number, maxPrice: number) => void;
}

export default function Slider({
  minPrice,
  maxPrice,
  onPriceChange,
}: SliderProps) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Sync the slider with parent state when minPrice or maxPrice changes
  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value <= localMaxPrice) {
      setLocalMinPrice(value);
      onPriceChange(value, localMaxPrice); // Notify the parent component
    }
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value >= localMinPrice) {
      setLocalMaxPrice(value);
      onPriceChange(localMinPrice, value); // Notify the parent component
    }
  };

  return (
    <div>
      <h2 className="text-md text-gray-700">Price Range</h2>
      <div className="slider-container">
        <input
          type="range"
          min={22}
          max={95}
          value={localMinPrice}
          onChange={handleMinPriceChange}
          className="range-thumb left-thumb"
        />
        <input
          type="range"
          min={22}
          max={95}
          value={localMaxPrice}
          onChange={handleMaxPriceChange}
          className="range-thumb right-thumb"
        />
        <div className="slider-track" />
        <div
          className="slider-range"
          style={{
            left: `${((localMinPrice - 22) / (95 - 22)) * 100}%`,
            right: `${100 - ((localMaxPrice - 22) / (95 - 22)) * 100}%`,
          }}
        />
        <div className="price-labels">
          <span>${localMinPrice}</span>
          <span>${localMaxPrice}</span>
        </div>
      </div>
    </div>
  );
}
