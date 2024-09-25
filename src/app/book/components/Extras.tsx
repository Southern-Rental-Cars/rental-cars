import React, { useState, useEffect } from 'react';

interface Extra {
  id: number;
  name: string;
  total_quantity: number;
  available_quantity: number;
  price_type: string;
  price_amount: number;
  description?: string;
}

interface ExtrasProps {
  extras: Extra[];
  startDate: string;
  endDate: string;
  onAddToCart: (extra: Extra, quantity: number) => void; // Callback to add extras to the cart
}

const Extras: React.FC<ExtrasProps> = ({ extras, startDate, endDate, onAddToCart }) => {
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [selectedQuantities, setSelectedQuantities] = useState<{ [key: number]: number }>({}); // To track selected quantities
  const [loadingAvailability, setLoadingAvailability] = useState(true); // Track loading for availability

  useEffect(() => {
    // Fetch available quantities based on selected dates and extras
    const fetchAvailability = async () => {
      try {
        // Send the extras, start_date, and end_date in the body of the POST request
        const response = await fetch('/api/extras/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            start_date: startDate,
            end_date: endDate,
            extras: extras.map(extra => ({ extra_id: extra.id, quantity: extra.total_quantity })),
          }),
        });
        const availabilityData = await response.json();
        setLoadingAvailability(false); // Set loading to false when the fetch is done
        // Set available quantities based on API response
        const updatedQuantities = extras.reduce((acc, extra) => {
          const availableExtra = availabilityData[extra.id];
          acc[extra.id] = availableExtra ? availableExtra.available_quantity : 0;
          return acc;
        }, {} as { [key: number]: number });

        setQuantities(updatedQuantities);
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };

    fetchAvailability();
  }, []);

  const handleQuantityChange = (extra: Extra, value: number) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [extra.id]: value,
    }));

    // Pass the selected extra and quantity to the parent component whenever the quantity changes
    onAddToCart(extra, value);
  };

  if (loadingAvailability) {
    return (
      <div className="bg-white p-5 flex justify-center items-center">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5">
      <div className="space-y-5">
        {extras.map((extra) => (
          <div
            key={extra.id}
            className={`p-4 border rounded-lg ${quantities[extra.id] > 0 ? '' : 'opacity-50 cursor-not-allowed'}`}
          >
            <h3 className="text-lg font-medium">{extra.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{extra.description}</p>
            <p className="text-sm font-semibold">Price: ${extra.price_amount} / {extra.price_type}</p>

            {quantities[extra.id] > 0 ? (
              <div className="mt-3 flex items-center space-x-3">
                <select
                  className="border p-2 rounded-lg"
                  value={selectedQuantities[extra.id] || 0} // Default to 0
                  onChange={(e) => handleQuantityChange(extra, Number(e.target.value))}
                >
                  {[...Array(quantities[extra.id] + 1).keys()].map((i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <p className="text-red-500 font-semibold mt-2">Not available for your selected dates</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Extras;
