import { useState, useEffect } from 'react';
import PriceRangeSlider from './PriceRangeSlider';
import MakeModelType from './MakeModelType';

interface FilterProps {
  onFilterChange: (minPrice: number, maxPrice: number, make: string, model: string, type: string) => void;
  initialPriceRange: [number, number];
  cars: { make: string; model: string; type: string }[];
}

export default function Filter({ onFilterChange, initialPriceRange, cars }: FilterProps) {
  const [tempMinPrice, setTempMinPrice] = useState(initialPriceRange[0]);
  const [tempMaxPrice, setTempMaxPrice] = useState(initialPriceRange[1]);
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedType, setSelectedType] = useState('');

  useEffect(() => {
    setTempMinPrice(initialPriceRange[0]);
    setTempMaxPrice(initialPriceRange[1]);
  }, [initialPriceRange]);

  const handleFilterChange = () => {
    onFilterChange(tempMinPrice, tempMaxPrice, selectedMake, selectedModel, selectedType);
  };

  const handleMakeModelTypeChange = (make: string, model: string, type: string) => {
    setSelectedMake(make);
    setSelectedModel(model);
    setSelectedType(type);
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg w-80">
      <h2 className="text-xl font-semibold mb-4">Filters</h2>
      
      {/* Price Range Slider */}
      <PriceRangeSlider
        minPrice={tempMinPrice}
        maxPrice={tempMaxPrice}
        onMinPriceChange={setTempMinPrice}
        onMaxPriceChange={setTempMaxPrice}
      />

      {/* Make, Model, Type Dropdowns */}
      <MakeModelType
        cars={cars}
        onMakeModelTypeChange={handleMakeModelTypeChange}
      />

      {/* Apply Button */}
      <button
        onClick={handleFilterChange}
        className="block w-full bg-blue-600 text-white py-2 rounded-md"
      >
        Apply Filters
      </button>
    </div>
  );
}
