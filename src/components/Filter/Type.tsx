import { useState, useEffect } from 'react';

interface Car {
  type: string;
}

interface CarClassProps {
  cars: Car[];
  onCarClassChange: (selectedTypes: string[]) => void;
  resetFilter: boolean; // New prop to reset filters
}

export default function CarType({ cars, onCarClassChange, resetFilter }: CarClassProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Get unique types from the car list
  const uniqueTypes = [...new Set(cars.map((car) => car.type))];

  // Handle type change
  const handleTypeChange = (type: string) => {
    if (type === 'All Types') {
      setSelectedTypes([]); // Clear all selections for "All Types"
    } else {
      setSelectedTypes((prevSelectedTypes) =>
        prevSelectedTypes.includes(type)
          ? prevSelectedTypes.filter((selectedType) => selectedType !== type) // Deselect
          : [...prevSelectedTypes, type] // Select
      );
    }
  };

  // Reset filters when `resetFilter` changes to true
  useEffect(() => {
    if (resetFilter) {
      setSelectedTypes([]); // Resets to "All Types"
    }
  }, [resetFilter]);

  // Synchronize state with parent component
  useEffect(() => {
    onCarClassChange(selectedTypes);
  }, [selectedTypes]);

  return (
    <div className="mb-4">
      {/* Type Filter */}
      <div className="mb-4">
        <label className="block text-md font-medium text-gray-700">Type</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {/* "All Types" Checkbox */}
          <label className="inline-flex items-center space-x-2">
            <input
              type="checkbox"
              value="All Types"
              checked={selectedTypes.length === 0} // Checked if no types are selected
              onChange={() => handleTypeChange('All Types')}
              className="form-checkbox"
            />
            <span>All Types</span>
          </label>

          {/* Dynamic Type Checkboxes */}
          {uniqueTypes.map((type) => (
            <label key={type} className="inline-flex items-center space-x-2">
              <input
                type="checkbox"
                value={type}
                checked={selectedTypes.includes(type)}
                onChange={() => handleTypeChange(type)}
                className="form-checkbox"
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
