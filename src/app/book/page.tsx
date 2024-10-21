'use client';

import React, { useState } from 'react';
import Dates from './components/Dates';
import Grid from './components/Grid';
import Details from './components/details/DetailsPage';
import PaymentDataProvider from './components/payment/PaymentDataProvider'; // Import PaymentDataProvider
import { Vehicle } from '@/types';

export default function Book() {
  const [dateRange, setDateRange] = useState({
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  });

  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // Track the selected vehicle
  const [isProceedingToPayment, setIsProceedingToPayment] = useState(false); // Track if the user proceeds to payment

  // Fetch vehicles based on the date range
  const fetchAvailableVehicles = async (start: string, end: string) => {
    try {
      const response = await fetch(`/api/vehicle?start=${start}&end=${end}`);
      const data = await response.json();
      setFilteredVehicles(data);
    } catch (error) {
      console.error('Error fetching available vehicles:', error);
    }
  };

  const handleDateChange = (start: string, end: string) => {
    setDateRange({ startDateTime: start, endDateTime: end });
    fetchAvailableVehicles(start, end);
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleBack = () => {
    if (isProceedingToPayment) {
      setIsProceedingToPayment(false); // Navigate back to details page
    } else {
      setSelectedVehicle(null); // Navigate back to vehicle list
    }
  };

  const handleProceedToPayment = () => {
    setIsProceedingToPayment(true); // Navigate to payment page
  };

  // If proceeding to payment, render the PaymentDataProvider
  if (isProceedingToPayment && selectedVehicle) {
    return (
      <PaymentDataProvider
        vehicle={selectedVehicle}
        startDateTime={dateRange.startDateTime}
        endDateTime={dateRange.endDateTime}
        totalCost={selectedVehicle.price * (new Date(dateRange.endDateTime).getDate() - new Date(dateRange.startDateTime).getDate())}
        onBackToDetails={handleBack} // Pass the back function to PaymentDataProvider
      />
    );
  }
  // If a vehicle is selected, render the details page
  if (selectedVehicle) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Details
          vehicle={selectedVehicle}
          onBack={handleBack}
          onProceedToPayment={handleProceedToPayment}
          startDateTime={dateRange.startDateTime}
          endDateTime={dateRange.endDateTime}
        />
      </div>
    );
  }
  // Render the vehicle selection and grid by default
  return (
    <div className="flex flex-col items-center justify-center">
      <Dates onDateChange={handleDateChange} defaultStartDateTime={dateRange.startDateTime} defaultEndDateTime={dateRange.endDateTime} />
      {filteredVehicles.length > 0 && (
        <div className="mt-8 w-full max-w-6xl">
          <Grid vehicles={filteredVehicles} onSelectVehicle={handleSelectVehicle} />
        </div>
      )}
    </div>
  );
}
