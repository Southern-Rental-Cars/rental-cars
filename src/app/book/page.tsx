'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Dates from './components/Dates';
import Grid from './components/Grid';
import DetailsPage from './components/details/DetailsView';
import PaymentDataProvider from './components/payment/DataProvider';
import Loader from '@/components/Loader';
import { Vehicle, VehicleImages } from '@/types';
import { fetchAvailableVehicles, fetchImages } from '@/utils/db/db';

const Book: React.FC = () => {
  const [dateRange, setDateRange] = useState({
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  });
  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [images, setImages] = useState<VehicleImages[] | null>(null);
  const [cachedAvailability, setCachedAvailability] = useState<any | null>(null); // Cache for availability data
  const [isProceedingToPayment, setIsProceedingToPayment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false); // NEW STATE
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchCompleted, setSearchCompleted] = useState(false); // Track search completion

  useEffect(() => {
    // Automatically fetch available vehicles for the initial date range
    fetchVehicles(dateRange.startDateTime, dateRange.endDateTime);
  }, [dateRange.startDateTime, dateRange.endDateTime]);

  const fetchVehicles = useCallback(async (start: string, end: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    setSearchCompleted(false); // Reset searchCompleted before fetching
    try {
      const vehicles = await fetchAvailableVehicles(start, end);
      setAvailableVehicles(vehicles);
      setSearchCompleted(true); // Mark search as completed
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setErrorMessage('Failed to load vehicles. Please try again.');
      setSearchCompleted(true); // Mark as completed even on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVehicleImages = useCallback(async (vehicleId: number) => {
    setIsDetailsLoading(true); // Mark details loading
    setErrorMessage(null);
    try {
      const vehicleImages = await fetchImages(vehicleId);
      setImages(vehicleImages);
    } catch (error) {
      console.error('Error fetching vehicle images:', error);
      setErrorMessage('Failed to load vehicle images. Please try again.');
    } finally {
      setIsDetailsLoading(false); // Reset details loading
    }
  }, []);

  const handleDateChange = useCallback(
    (start: string, end: string) => {
      setDateRange({ startDateTime: start, endDateTime: end });
      fetchVehicles(start, end);
    },
    [fetchVehicles]
  );

  const handleSelectVehicle = useCallback(
    async (vehicle: Vehicle) => {
      setIsDetailsLoading(true); // Start loading before updating vehicle
      await fetchVehicleImages(vehicle.id);
      setSelectedVehicle(vehicle); // Update vehicle only after images are fetched
    },
    [fetchVehicleImages]
  );

  const handleProceedToPayment = useCallback(() => {
    setIsProceedingToPayment(true);
  }, []);

  const handleBack = useCallback(() => {
    if (isProceedingToPayment) {
      setIsProceedingToPayment(false);
    } else {
      setSelectedVehicle(null);
    }
  }, [isProceedingToPayment]);

  if (isProceedingToPayment && selectedVehicle) {
    return (
      <PaymentDataProvider
        vehicle={selectedVehicle}
        startDateTime={dateRange.startDateTime}
        endDateTime={dateRange.endDateTime}
        cachedAvailability={cachedAvailability}
        setCachedAvailability={setCachedAvailability}
        onBack={handleBack}
      />
    );
  }

  if (selectedVehicle) {
    return isDetailsLoading ? ( // Show loader while details are loading
      <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
        <Loader />
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center">
        <DetailsPage
          vehicle={selectedVehicle}
          images={images || []}
          startDateTime={dateRange.startDateTime}
          endDateTime={dateRange.endDateTime}
          onBack={handleBack}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <Dates
          onDateChange={handleDateChange}
          defaultStartDateTime={dateRange.startDateTime}
          defaultEndDateTime={dateRange.endDateTime}
        />
      </div>
      {isLoading ? (
        <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50">
          <Loader />
        </div>
      ) : errorMessage ? (
        <p className="mt-8 text-red-600 text-lg font-semibold">{errorMessage}</p>
      ) : searchCompleted && availableVehicles.length === 0 ? (
        <p className="mt-8 text-gray-600 text-lg font-medium">
          Sorry, no vehicles are available for these dates. Please adjust your selection.
        </p>
      ) : (
        <div className="mt-8 w-full max-w-6xl">
          <Grid vehicles={availableVehicles} onSelectVehicle={handleSelectVehicle} />
        </div>
      )}
    </div>
  );
};

export default Book;
