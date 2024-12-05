'use client';

import React, { useState } from 'react';
import Dates from './components/Dates';
import Grid from './components/Grid';
import DetailsPage from './components/details/page';
import PaymentDataProvider from './components/payment/DataProvider';
import Loader from '@/components/Loader';
import { Vehicle, VehicleImages } from '@/types';
import { fetchAvailableVehicles, fetchImagesByVehicleId } from '@/utils/db/db';

export default function Book() {
  const [dateRange, setDateRange] = useState({
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  });

  const [availableVehicles, setAvailableVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [images, setImages] = useState<VehicleImages[] | null>(null);
  const [isProceedingToPayment, setIsProceedingToPayment] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchVehicles = async (start: string, end: string) => {
    setIsLoading(true);
    try {
      const data = await fetchAvailableVehicles(start, end);
      setAvailableVehicles(data);
      setSearchCompleted(true);
    } catch (error) {
      console.error('Error fetching available vehicles:', error);
      setSearchCompleted(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (isProceedingToPayment) {
      setIsProceedingToPayment(false);
    } else {
      setSelectedVehicle(null);
    }
  };

  const handleDateChange = (start: string, end: string) => {
    setDateRange({ startDateTime: start, endDateTime: end });
    setSearchCompleted(false);
    fetchVehicles(start, end);
  };

  const handleProceedToPayment = () => {
    setIsProceedingToPayment(true);
  };

  const handleSelectVehicle = async (vehicle: Vehicle) => {
    setIsLoading(true);
    setSelectedVehicle(vehicle);
    await fetchVehicleImages(vehicle.id);
    setIsLoading(false);
  };

  const fetchVehicleImages = async (vehicle_id: number) => {
    try {
      const images = await fetchImagesByVehicleId(vehicle_id);
      setImages(images);
    } catch (error) {
      console.error('Error fetching vehicle images:', error);
      setImages([]);
    }
  };

  if (isProceedingToPayment && selectedVehicle) {
    return (
      <PaymentDataProvider
        vehicle={selectedVehicle}
        startDateTime={dateRange.startDateTime}
        endDateTime={dateRange.endDateTime}
        onBackToDetails={handleBack}
      />
    );
  }

  if (selectedVehicle && images) {
    return (
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
      ) : searchCompleted && availableVehicles.length === 0 ? (
        <p className="mt-8 text-red-600 text-lg font-semibold">
          Sorry, our fleet is booked for these dates. We are looking to expand our fleet.
        </p>
      ) : (
        <div className="mt-8 w-full max-w-6xl">
          <Grid vehicles={availableVehicles} onSelectVehicle={handleSelectVehicle} />
        </div>
      )}
    </div>
  );
}
