import React, { useState } from 'react';
import { Extra } from '@/types/index';

interface Availability {
  [key: number]: {
    available_quantity: number;
  };
}

interface BoxProps {
  extras: Extra[];
  availability: Availability;
  onAddToCart: (extra: Extra, quantity: number) => void;
}

const ExtrasBox: React.FC<BoxProps> = ({ extras, availability, onAddToCart }) => {
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({});
  const [selectedTripExtras, setSelectedTripExtras] = useState<{ [key: number]: boolean }>({});

  const handleQuantityChange = (extra: Extra, value: number) => {
    setSelectedQuantities((prev) => ({ ...prev, [extra.id]: value }));
    onAddToCart(extra, value);
  };

  const handleTripChange = (extra: Extra, isChecked: boolean) => {
    setSelectedTripExtras((prev) => ({ ...prev, [extra.id]: isChecked }));
    onAddToCart(extra, isChecked ? 1 : 0);
  };

  const sortedExtras = extras.sort((a, b) => (a.price_type === 'DAILY' ? -1 : 1));

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Select Extras</h2>
      <div className="space-y-6">
        {sortedExtras.map((extra) => {
          const availableQuantity = availability[extra.id]?.available_quantity ?? 0;

          return extra.total_quantity !== null && extra.price_type === 'DAILY' ? (
            <DailyExtra
              key={extra.id}
              extra={extra}
              availableQuantity={availableQuantity}
              selectedQuantity={selectedQuantities[extra.id] || 0}
              onQuantityChange={handleQuantityChange}
            />
          ) : (
            <TripExtra
              key={extra.id}
              extra={extra}
              isSelected={selectedTripExtras[extra.id] || false}
              onTripChange={handleTripChange}
            />
          );
        })}
      </div>
    </div>
  );
};

// Separate components for better readability and reusability
const DailyExtra: React.FC<{
  extra: Extra;
  availableQuantity: number;
  selectedQuantity: number;
  onQuantityChange: (extra: Extra, value: number) => void;
}> = ({ extra, availableQuantity, selectedQuantity, onQuantityChange }) => (
  <div className={`p-4 rounded-lg border ${availableQuantity > 0 ? 'bg-gray-50' : 'opacity-50 bg-gray-100'}`}>
    <h3 className="text-lg font-medium text-gray-800">{extra.name}</h3>
    {extra.description && <p className="text-sm text-gray-500 mb-3">{extra.description}</p>}
    <p className="text-md font-semibold text-gray-700">${extra.price_amount} / {extra.price_type}</p>
    {availableQuantity > 0 ? (
      <div className="mt-4 flex items-center">
        <label htmlFor={`quantity-${extra.id}`} className="text-sm text-gray-600 mr-2">Quantity:</label>
        <select
          id={`quantity-${extra.id}`}
          className="border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          value={selectedQuantity}
          onChange={(e) => onQuantityChange(extra, Number(e.target.value))}
        >
          {[...Array(availableQuantity + 1).keys()].map((i) => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>
    ) : (
      <p className="text-red-500 font-semibold mt-3">Unavailable at this time</p>
    )}
  </div>
);

const TripExtra: React.FC<{
  extra: Extra;
  isSelected: boolean;
  onTripChange: (extra: Extra, isChecked: boolean) => void;
}> = ({ extra, isSelected, onTripChange }) => (
  <div className={`p-4 rounded-lg border bg-gray-50 ${isSelected ? 'ring-2 ring-blue-600' : ''}`}>
    <label htmlFor={`trip-${extra.id}`} className="flex items-center space-x-3 cursor-pointer">
      <span className="text-lg font-medium text-gray-800">{extra.name}</span>
      <input
        type="checkbox"
        id={`trip-${extra.id}`}
        checked={isSelected}
        onChange={(e) => onTripChange(extra, e.target.checked)}
        className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
      />
    </label>
    {extra.description && <p className="text-sm text-gray-500 mt-2">{extra.description}</p>}
    <p className="text-md font-semibold text-gray-700 mt-2">${extra.price_amount} / {extra.price_type}</p>
  </div>
);

export default ExtrasBox;