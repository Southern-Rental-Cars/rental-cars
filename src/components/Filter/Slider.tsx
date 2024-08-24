import { useEffect } from 'react';
import './static/index.css'; // Slider-specific CSS

interface SliderProps {
  minPrice: number;
  maxPrice: number;
  onMinPriceChange: (value: number) => void;
  onMaxPriceChange: (value: number) => void;
}

export default function Slider({
  minPrice,
  maxPrice,
  onMinPriceChange,
  onMaxPriceChange,
}: SliderProps) {

  useEffect(() => {
    onMinPriceChange(minPrice);
    onMaxPriceChange(maxPrice);
  }, [minPrice, maxPrice]);

  return (
    <div>
      <h2 className="text-md text-gray-700">Price Range</h2>
      <div className="slider-container">
        <input
          type="range"
          min={22}
          max={95}
          value={minPrice}
          onChange={(e) => onMinPriceChange(Number(e.target.value))}
          className="range-thumb left-thumb"
        />
        <input
          type="range"
          min={22}
          max={95}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="range-thumb right-thumb"
        />
        <div className="slider-track" />
        <div
          className="slider-range"
          style={{
            left: `${((minPrice - 22) / (95 - 22)) * 100}%`,
            right: `${100 - ((maxPrice - 22) / (95 - 22)) * 100}%`,
          }}
        />
        <div className="price-labels">
          <span>${minPrice}</span>
          <span>${maxPrice}</span>
        </div>
      </div>
    </div>
  );
}
