'use client';

import React, { useState } from 'react';
import SelectDates from './components/SelectDates';
import VehicleGrid from './components/vehicle/VehicleGrid';
import VehicleDetail from './components/vehicle/VehicleDetails';
import { Vehicle } from '@/types';

export default function Book() {
  const [dateRange, setDateRange] = useState({
    startDateTime: new Date().toISOString(),
    endDateTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
  });

  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null); // Track the selected vehicle

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
    setSelectedVehicle(vehicle); // Set the selected vehicle
  };

  const handleBackToVehicleList = () => {
    setSelectedVehicle(null); // Reset selected vehicle to go back to the vehicle list
  };

  // If a vehicle is selected, show the VehicleDetail component
  if (selectedVehicle) {
    return (
      <div className="flex flex-col items-center justify-center">
        <VehicleDetail vehicle={selectedVehicle} onBack={handleBackToVehicleList} />
      </div>
    );
  }

  // Show the vehicle grid and search form
  return (
    <div className="flex flex-col items-center justify-center">
      <SelectDates
        onDateChange={handleDateChange}
        defaultStartDateTime={dateRange.startDateTime}
        defaultEndDateTime={dateRange.endDateTime}
      />

      {filteredVehicles.length > 0 && (
        <div className="mt-8 w-full max-w-6xl">
          <VehicleGrid vehicles={filteredVehicles} onSelectVehicle={handleSelectVehicle} />
        </div>
      )}
    </div>
  );
}
