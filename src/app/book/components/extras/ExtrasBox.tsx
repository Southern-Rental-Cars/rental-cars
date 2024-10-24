import React, { useState } from 'react';

interface Extra {
  id: number;
  name: string;
  price_amount: number;
  price_type: 'DAILY' | 'TRIP';
  description?: string;
}

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

  // Handle changes for DAILY extras (with quantity)
  const handleQuantityChange = (extra: Extra, value: number) => {
    setSelectedQuantities((prev) => ({ ...prev, [extra.id]: value }));
    onAddToCart(extra, value);
  };

  // Handle changes for TRIP extras (with checkbox)
  const handleTripChange = (extra: Extra, isChecked: boolean) => {
    setSelectedTripExtras((prev) => ({ ...prev, [extra.id]: isChecked }));
    onAddToCart(extra, isChecked ? 1 : 0); // 1 if checked, 0 if unchecked
  };

  // Sort extras: DAILY at the top, TRIP at the bottom
  const sortedExtras = extras.sort((a, b) => (a.price_type === 'DAILY' ? -1 : 1));

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Extras</h2>
      <div className="space-y-6">
        {sortedExtras.map((extra) => {
          const availableQuantity = availability[extra.id]?.available_quantity || 0;

          // For DAILY extras, show quantity dropdown
          if (extra.price_type === 'DAILY') {
            return (
              <div
                key={extra.id}
                className={`p-6 rounded-lg border ${
                  availableQuantity > 0 ? 'bg-gray-50 duration-300' : 'opacity-50 bg-gray-100'
                }`}
              >
                <h3 className="text-lg font-medium text-gray-800">{extra.name}</h3>
                {extra.description && (
                  <p className="text-sm text-gray-500 mb-3">{extra.description}</p>
                )}
                <p className="text-md font-semibold text-gray-700">
                  ${extra.price_amount} / {extra.price_type}
                </p>
                {availableQuantity > 0 ? (
                  <div className="mt-4 flex items-center space-x-3">
                    <label htmlFor={`quantity-${extra.id}`} className="text-sm text-gray-600">
                      Quantity:
                    </label>
                    <select
                      id={`quantity-${extra.id}`}
                      className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      value={selectedQuantities[extra.id] || 0}
                      onChange={(e) => handleQuantityChange(extra, Number(e.target.value))}
                    >
                      {[...Array(availableQuantity + 1).keys()].map((i) => (
                        <option key={i} value={i}>
                          {i}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <p className="text-red-500 font-semibold mt-3">Unavailable at this time</p>
                )}
              </div>
            );
          }

          // For TRIP extras, show checkbox
          return (
            <div
              key={extra.id}
              className={`p-6 rounded-lg border bg-gray-50 duration-300 ${
                selectedTripExtras[extra.id] ? 'ring-2 ring-blue-600' : ''
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-gray-800">{extra.name}</h3>
                  {extra.description && (
                    <p className="text-sm text-gray-500 mb-3">{extra.description}</p>
                  )}
                  <p className="text-md font-semibold text-gray-700">
                    ${extra.price_amount} / {extra.price_type}
                  </p>
                </div>
                <input
                  type="checkbox"
                  id={`trip-${extra.id}`}
                  checked={selectedTripExtras[extra.id] || false}
                  onChange={(e) => handleTripChange(extra, e.target.checked)}
                  className="w-6 h-6 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExtrasBox;
