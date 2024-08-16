import { useState, useEffect } from 'react';

interface Car {
  make: string;
  model: string;
  type: string;
}

interface MakeModelTypeProps {
  cars: Car[];
  onMakeModelTypeChange: (make: string, model: string, type: string) => void;
}

export default function MakeModelType({ cars, onMakeModelTypeChange }: MakeModelTypeProps) {
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedType, setSelectedType] = useState('');

  // Get unique makes, models, and types from the car list
  const uniqueMakes = [...new Set(cars.map((car) => car.make))];
  const uniqueModels = [...new Set(cars.filter(car => car.make === selectedMake).map((car) => car.model))];
  const uniqueTypes = [...new Set(cars.map((car) => car.type))];

  // Update the filter when the selections change
  useEffect(() => {
    onMakeModelTypeChange(selectedMake, selectedModel, selectedType);
  }, [selectedMake, selectedModel, selectedType]);

  return (
    <div className="mb-4">
      {/* Make and Model Side by Side */}
      <div className="flex justify-between mb-4">
        {/* Make Dropdown */}
        <div className="w-1/2 pr-2">
          <label className="block text-sm font-medium text-gray-700">Make</label>
          <select
            value={selectedMake}
            onChange={(e) => setSelectedMake(e.target.value)}
            className="block w-full p-2 border rounded-md"
          >
            <option value="">All Makes</option>
            {uniqueMakes.map((make) => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        {/* Model Dropdown */}
        <div className="w-1/2 pl-2">
          <label className="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="block w-full p-2 border rounded-md"
            disabled={!selectedMake}
          >
            <option value="">All Models</option>
            {uniqueModels.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Type Dropdown */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Type</label>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="block w-full p-2 border rounded-md"
        >
          <option value="">All Types</option>
          {uniqueTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
