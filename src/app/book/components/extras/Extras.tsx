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

interface ExtrasProps {
  extras: Extra[];
  availability: Availability;
  onAddToCart: (extra: Extra, quantity: number) => void;
}

const Extras: React.FC<ExtrasProps> = ({ extras, availability, onAddToCart }) => {
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({});

  // Handle quantity change for extras
  const handleQuantityChange = (extra: Extra, value: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [extra.id]: value,
    }));
    onAddToCart(extra, value);
  };

  return (
    <div className="bg-white p-5">
      <div className="space-y-5">
        {extras.map((extra) => {
          const availableQuantity = availability[extra.id]?.available_quantity || 0;

          return (
            <div key={extra.id} className={`p-4 border rounded-lg ${availableQuantity > 0 ? '' : 'opacity-50'}`}>
              <h3 className="text-lg font-medium">{extra.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{extra.description}</p>
              <p className="text-md font-semibold">${extra.price_amount} / {extra.price_type}</p>

              {availableQuantity > 0 ? (
                <div className="mt-3 flex items-center space-x-3">
                  <select
                    className="border p-2 rounded-lg"
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
                <p className="text-red-500 font-semibold mt-2">Not available</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Extras;
