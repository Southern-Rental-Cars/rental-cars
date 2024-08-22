import { useState, useEffect } from 'react';

interface Car {
  type: string;
}

interface TypeProps {
  cars: Car[];
  onCarClassChange: (selectedTypes: string[]) => void;
  resetFilter: boolean;
  selectedTypes: string[]; // Selected types passed from parent
}

export default function Type({
  cars,
  onCarClassChange,
  resetFilter,
  selectedTypes,
}: TypeProps) {
  const [selectedTypesState, setSelectedTypesState] = useState<string[]>(selectedTypes);

  // Get unique car types from the car list
  const uniqueTypes = [...new Set(cars.map((car) => car.type))];

  // Handle type change
  const handleTypeChange = (type: string) => {
    let updatedSelectedTypes: string[];

    if (type === 'All Types') {
      updatedSelectedTypes = []; // Clear all selections for "All Types"
    } else {
      updatedSelectedTypes = selectedTypesState.includes(type)
        ? selectedTypesState.filter((selectedType) => selectedType !== type) // Deselect type
        : [...selectedTypesState, type]; // Select type
    }

    setSelectedTypesState(updatedSelectedTypes);
    onCarClassChange(updatedSelectedTypes); // Pass selected types to parent component
  };

  // Update state when `resetFilter` or `selectedTypes` props change
  useEffect(() => {
    setSelectedTypesState(selectedTypes);
  }, [resetFilter, selectedTypes]);

  return (
    <div className="mb-4">
      <label className="block text-md font-medium text-gray-700">Type</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {/* "All Types" Checkbox */}
        <label className="inline-flex items-center space-x-2">
          <input
            type="checkbox"
            value="All Types"
            checked={selectedTypesState.length === 0} // Checked if no types are selected
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
              checked={selectedTypesState.includes(type)}
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
