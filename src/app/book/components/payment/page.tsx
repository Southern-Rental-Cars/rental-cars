'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Extras from '../extras/box';
import { useRouter } from 'next/navigation';
import { useUser } from '@/components/contexts/UserContext';
import { Extra, PaypalData, PaymentPageProps } from '@/types';
import { FaArrowLeft } from 'react-icons/fa';
import { differenceInDays, format } from 'date-fns';
import SecureCheckout from './PaypalButtons';

const Payment: React.FC<PaymentPageProps> = ({ vehicle, startDate, endDate, extras, availability,onBackToDetails }) => {
  const [selectedExtras, setSelectedExtras] = useState<Extra[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [taxAmount, setTaxAmount] = useState<number>(0);
  const [rentalPeriod, setRentalPeriod] = useState<number>(0);
  const [deliverySelected, setDeliverySelected] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState<'local' | 'IAH' | null>(null);
  const [streetAddress, setStreetAddress] = useState('');
  const [apartment, setApartment] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [formattedAddress, setFormattedAddress] = useState('');

  const { user } = useUser();
  const userId = user?.id;
  const router = useRouter();

  const calculateRentalPeriod = () => differenceInDays(new Date(endDate), new Date(startDate)) + 1;

// Inside the component
const getTotalPrice = useCallback(() => {
  const rentalPeriod = calculateRentalPeriod();
  setRentalPeriod(rentalPeriod);

  const vehicleSubtotal = vehicle.price * rentalPeriod;
  const extrasCost = selectedExtras.reduce((total, extra) => {
    const cost = extra.price_type === 'DAILY'
      ? extra.price_amount * (extra.quantity || 1) * rentalPeriod
      : extra.price_amount * (extra.quantity || 1);
    return total + cost;
  }, 0);

  const deliveryCost = deliverySelected
    ? (deliveryOption === 'local' ? 40 : deliveryOption === 'IAH' ? 120 : 0)
    : 0;

  const updatedSubtotal = vehicleSubtotal + extrasCost + deliveryCost;
  const updatedTax = parseFloat((updatedSubtotal * 0.0825).toFixed(2));

  setTaxAmount(updatedTax);
  setTotalPrice(parseFloat((updatedSubtotal + updatedTax).toFixed(2)));
}, [ startDate, endDate, selectedExtras, deliveryOption, deliverySelected, calculateRentalPeriod]);

  useEffect(() => {
    getTotalPrice();
  }, [startDate, endDate, selectedExtras, deliveryOption, deliverySelected, isAddressSaved]);

  const handleAddToCart = (extra: Extra, quantity: number) => {
    setSelectedExtras((prevExtras) => {
      const updatedExtras = prevExtras.filter((item) => item.id !== extra.id);
      if (quantity > 0) {
        updatedExtras.push({ ...extra, quantity });
      }
      return updatedExtras;
    });
  };

  const handleDeliveryChange = (option: 'local' | 'IAH' | null) => {
    setDeliveryOption(option);
    setStreetAddress('');
    setApartment('');
    setCity('');
    setZipCode('');
    setIsAddressSaved(false);
    setFormattedAddress('');
  };

  const handleSaveAddress = () => {
    if (streetAddress && city && zipCode) {
      const address = `${streetAddress}${apartment ? ', ' + apartment : ''}, ${city}, TX ${zipCode}`;
      setFormattedAddress(address);
      setIsAddressSaved(true);
    }
  };

  const isPaymentEnabled = !(
    deliveryOption === 'local' &&
    (!isAddressSaved)
  );

  const handlePaymentSuccess = async (paypalData: PaypalData) => {
    const payload = {
      vehicle_id: vehicle.id,
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice.toFixed(2),
      extras: selectedExtras,
      paypal_order_id: paypalData.paypal_order_id,
      paypal_transaction_id: paypalData.paypal_transaction_id,
      is_paid: paypalData.is_paid,
      delivery_required: deliverySelected,
      delivery_type: deliveryOption,
      delivery_cost: deliveryOption === 'local' ? 40 : deliveryOption === 'IAH' ? 120 : 0,
      delivery_address: deliveryOption === 'local' && isAddressSaved ? formattedAddress : null,
    };

    try {
      const response = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });

      const responseData = await response.json();
      if (responseData?.id) {
        router.push(`/book/${responseData.id}`);
      } else {
        console.error('Booking could not be confirmed.');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
    }
  };

  const formattedStartDate = format(new Date(startDate), 'MMM dd, yyyy');
  const formattedEndDate = format(new Date(endDate), 'MMM dd, yyyy');

  return (
    <div className="max-w-3xl w-full mx-auto p-6 rounded-lg space-y-6 mt-3">
      <button onClick={onBackToDetails} className="flex items-center text-blue-600 font-semibold mb-3">
        <FaArrowLeft className="mr-2" /> Back
      </button>

      {/* Unified Card */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <Extras extras={extras} availability={availability} onAddToCart={handleAddToCart} />
      </div>

      {/* Booking Summary Card */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Booking Summary</h2>

        {/* Date Information */}
        <div className="flex justify-between text-md text-gray-700">
          <p>From:</p>
          <p className="font-medium">{formattedStartDate}</p>
        </div>
        <div className="flex justify-between text-md text-gray-700">
          <p>To:</p>
          <p className="font-medium">{formattedEndDate}</p>
        </div>

        {/* Delivery Option */}
        <div className="mt-3">
          <label className="flex items-center text-md text-gray-700">
            <input
              type="checkbox"
              className="mr-2"
              checked={deliverySelected}
              onChange={() => {
                setDeliverySelected(!deliverySelected);
                handleDeliveryChange(null); // Reset delivery options when toggling
              }}
            />
            Delivery required
          </label>

          {!deliverySelected && (
            <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-3 rounded-md border border-gray-200">
              Default pickup address: <strong>16753 Donwick Dr Suite A12, The Woodlands, TX 77385</strong>
            </div>
          )}

          {deliverySelected && (
            <div className="ml-6 mt-2 space-y-2">
              <label className="flex items-center text-md text-gray-700">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="local"
                  checked={deliveryOption === 'local'}
                  onChange={() => handleDeliveryChange('local')}
                  className="mr-2"
                />
                Local Delivery (within 10 miles): $40
              </label>
              <label className="flex items-center text-md text-gray-700">
                <input
                  type="radio"
                  name="deliveryOption"
                  value="IAH"
                  checked={deliveryOption === 'IAH'}
                  onChange={() => handleDeliveryChange('IAH')}
                  className="mr-2"
                />
                Delivery to IAH Airport: $120
              </label>

              {/* Address input fields for Local Delivery */}
              {deliveryOption === 'local' && (
                <div className="mt-4">
                  <label className="block text-md text-gray-700 mb-2">Delivery Address:</label>
                  {isAddressSaved ? (
                    <div className="mt-2 text-sm text-gray-700 bg-gray-100 p-3 rounded-md border border-gray-200">
                      <strong>Saved delivery address:</strong> {formattedAddress}
                      <button
                        onClick={() => setIsAddressSaved(false)}
                        className="ml-2 text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div>
                      <form onSubmit={handleSaveAddress} className="space-y-2">
                        <div className="grid grid-cols-1 gap-4">
                          <input
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                            placeholder="Street Address *"
                            value={streetAddress}
                            onChange={(e) => setStreetAddress(e.target.value)}
                            required
                            minLength={3}
                          />
                          <input
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                            placeholder="Apartment, suite (optional)"
                            value={apartment}
                            onChange={(e) => setApartment(e.target.value)}
                          />
                          <input
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                            placeholder="City *"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            required
                          />
                          <input
                            type="text"
                            className="border border-gray-300 rounded-md p-2"
                            placeholder="Postal code *"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            required
                            pattern="^\d{5}(-\d{4})?$"
                            title="Please enter a valid ZIP code (e.g., 12345 or 12345-6789)"
                          />
                        </div>
                        <button
                          type="submit"
                          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
                        >
                          Save
                        </button>
                      </form>
                    </div>
                  )}
          </div>
        )}
      </div>
          )}
        </div>


        {/* Extras Section */}
        {selectedExtras.length > 0 && (
          <>
            <hr className="my-4 border-gray-300" />
            <ul className="space-y-1">
              {selectedExtras.map((extra) => {
                const quantity = extra.quantity ?? 1;
                const extraCost =
                  extra.price_type === 'DAILY'
                    ? extra.price_amount * quantity * rentalPeriod
                    : extra.price_amount * quantity;

                return (
                  <li key={extra.id} className="flex justify-between text-md text-gray-700">
                    <span>{extra.name} ({extra.price_type === 'DAILY' ? `${rentalPeriod} days` : 'one-time'}):</span>
                    <span className="font-medium">${extraCost.toFixed(2)}</span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
        <hr className="my-4 border-gray-300" />

        {/* Payment Details Section */}
        <div className="flex justify-between text-md text-gray-700">
          <p>Daily rate:</p>
          <p className="font-medium">${vehicle.price.toFixed(2)}</p>
        </div>
        <div className="flex justify-between text-md text-gray-700">
          <p>Rental period:</p>
          <p className="font-medium"> {rentalPeriod} {rentalPeriod === 1 ? 'day' : 'days'}</p>
        </div>
        <div className="flex justify-between text-md text-gray-700">
          <p>Sales tax (8.25%):</p>
          <p className="font-medium">${taxAmount.toFixed(2)}</p>
        </div>

        {/* Final Divider */}
        <hr className="my-4 border-gray-300" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">Total:</span>
          <span className="text-xl font-bold text-gray-900">${totalPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Card */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Secure Checkout</h2>
        <div className="flex justify-center">
          {isPaymentEnabled && (
            <SecureCheckout 
              key={totalPrice} 
              totalPrice={totalPrice} 
              onPaymentSuccess={handlePaymentSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
