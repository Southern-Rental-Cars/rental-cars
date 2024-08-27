import { useState, useEffect } from 'react';
import { CarTypeProps } from '@/app/cars/types';

export default function CarType({ cars, selectedTypes, onCarClassChange }: CarTypeProps) {
  const [types, setTypes] = useState<string[]>(selectedTypes);

  // Get unique types from the car list
  const existingTypes = [...new Set(cars.map((car) => car.type))];

  // Handle type change
  const handleTypeChange = (type: string) => {
    if (type === 'All Types') {
      setTypes([]); // Clear all selections for "All Types"
      onCarClassChange([]); // Propagate changes to the parent
    } else {
      const updatedTypes = types.includes(type)
        ? types.filter((selectedType) => selectedType !== type) // Deselect
        : [...types, type]; // Select
      setTypes(updatedTypes);
      onCarClassChange(updatedTypes); // Propagate changes to the parent
    }
  };

  // Sync local types state with parent selectedTypes state
  useEffect(() => {
    setTypes(selectedTypes);
  }, [selectedTypes]);

  return (
    <div className="mb-4">
      <label className="block text-md font-medium text-gray-700">Type</label>
      <div className="flex flex-wrap gap-2 mt-2">
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            value="All Types"
            checked={types.length === 0} // Checked if no types are selected
            onChange={() => handleTypeChange('All Types')}
            className="form-checkbox"
          />
          <span>All Types</span>
        </label>

        {existingTypes.map((type) => (
          <label key={type} className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              value={type}
              checked={types.includes(type)}
              onChange={() => handleTypeChange(type)}
              className="form-checkbox"
            />
            <span>{type}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
