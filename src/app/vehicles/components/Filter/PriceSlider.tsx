import { useEffect, useState } from 'react';
import { CarPriceRangeProps } from '@/types';
import './static/styles.css';
import MultiRangeSlider from "multi-range-slider-react";

export default function PriceSlider({minPrice, maxPrice, onPriceChange}: CarPriceRangeProps) {
  const [localMinPrice, setLocalMinPrice] = useState(minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(maxPrice);

  // Sync the slider with parent state when minPrice or maxPrice changes
  useEffect(() => {
    setLocalMinPrice(minPrice);
    setLocalMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  return (
    <div className='mb-4'>
      <h2 className="text-md text-gray-700">Price Range</h2>
      <div className="relative w-full">
        <MultiRangeSlider
          min={22}
          max={120}
          step={5}
          minValue={localMinPrice}
          maxValue={localMaxPrice}
          barLeftColor="#ddd"
          barRightColor="#ddd"
          barInnerColor="#3b82f6"
          thumbLeftColor="#3b82f6"
          thumbRightColor="#3b82f6"
          ruler={false} // To show a ruler
          label={false} // To show labels on the thumbs
          style={{
            boxShadow: 'none',  // Removes shadow
            border: 'none',      // Removes border
          }}
            onInput={(e) => {
            onPriceChange(e.minValue, e.maxValue);
          }}
        />
        <div className="flex justify-between text-sm text-black mt-[-15px]">
          <span>${localMinPrice}</span>
          <span>${localMaxPrice}</span>
        </div>
      </div>
    </div>
  );
}
