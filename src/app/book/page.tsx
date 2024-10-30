'use client';

import React, { useState } from 'react';
import Dates from './components/Dates';
import Grid from './components/Grid';
import Details from './components/details/page';
import PaymentDataProvider from './components/payment/DataProvider';
import Loader from '@/components/Loader';
import { Vehicle, VehicleImages } from '@/types';
import { differenceInDays } from 'date-fns';
import { fetchImagesByVehicleId } from '@/lib/db/db';

export default function Book() {
  const [dateRange, setDateRange] = useState({
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  });

  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [images, setImages] = useState<VehicleImages[] | null>(null); // Set default to empty array
  const [isProceedingToPayment, setIsProceedingToPayment] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch vehicles based on the date range
  const fetchAvailableVehicles = async (start: string, end: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/vehicle?start=${start}&end=${end}`);
      const data = await response.json();
      setAvailableVehicles(data);
      setSearchCompleted(true);
    } catch (error) {
      console.error('Error fetching available vehicles:', error);
      setSearchCompleted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (start: string, end: string) => {
    setDateRange({ startDateTime: start, endDateTime: end });
    setSearchCompleted(false);
    fetchAvailableVehicles(start, end);
  };

  // Select a vehicle and fetch its images
  const handleSelectVehicle = async (vehicle: Vehicle) => {
    setIsLoading(true);
    setSelectedVehicle(vehicle); // Set the selected vehicle
    await fetchVehicleImages(vehicle.id);
    setIsLoading(false);

  };

  const fetchVehicleImages = async (vehicle_id: number) => {
    try {
        const images = await fetchImagesByVehicleId(vehicle_id); // Ensure this function returns data
        setImages(images);
    } catch (error) {
        console.error('Error fetching vehicle images:', error);
        setImages([]); // Default to empty array if there's an error
    }
};

  const handleBack = () => {
    if (isProceedingToPayment) {
      setIsProceedingToPayment(false);
    } else {
      setSelectedVehicle(null);
    }
  };

  const handleProceedToPayment = () => {
    setIsProceedingToPayment(true);
  };

  /* Date range calculation */
  const startDate = new Date(dateRange.startDateTime);
  const endDate = new Date(dateRange.endDateTime);
  const bookedDays = differenceInDays(endDate, startDate) + 1;

  // Render Payments page
  if (isProceedingToPayment && selectedVehicle) {
    return (
      <PaymentDataProvider
        vehicle={selectedVehicle}
        startDateTime={dateRange.startDateTime}
        endDateTime={dateRange.endDateTime}
        subTotal={selectedVehicle.price * bookedDays}
        onBackToDetails={handleBack}
      />
    );
  }

  // Render details page
  if (selectedVehicle && images) {
    return (
      <div className="flex flex-col items-center justify-center">
        <Details
          vehicle={selectedVehicle}
          images={images || []} // Ensure images is an array (fallback to empty array)
          onBack={handleBack}
          onProceedToPayment={handleProceedToPayment}
          startDateTime={dateRange.startDateTime}
          endDateTime={dateRange.endDateTime}
        />
      </div>
    );
  }
  // Render the vehicle selection grid by default
  return (
    <div className="flex flex-col items-center justify-center">
      <Dates onDateChange={handleDateChange} defaultStartDateTime={dateRange.startDateTime} defaultEndDateTime={dateRange.endDateTime} />
      {/* Show loading spinner when fetching results */}
      {isLoading ? (
        <div className="mt-8">
          <Loader />
        </div>
      ) : searchCompleted && availableVehicles.length === 0 ? (
        <p className="mt-8 text-red-600 text-lg font-semibold">Sorry, our fleet is booked for these dates</p>
      ) : (
        <div className="mt-8 w-full max-w-6xl">
          <Grid vehicles={availableVehicles} onSelectVehicle={handleSelectVehicle} />
        </div>
      )}
    </div>
  );
}