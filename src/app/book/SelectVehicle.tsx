import React from 'react';
import ConfirmBook from './components/ConfirmBook';
import { fetchExtras, fetchExtrasAvailability } from '@/lib/db/queries';

interface SearchParams {
  carId: string;
  carName: string;
  startDate: string;
  endDate: string;
  totalCost: string;
}

export default async function BookVehicle({ searchParams }: { searchParams: SearchParams }) {
  const { carId, startDate, endDate, totalCost } = searchParams;
  if (!carId || !startDate || !endDate || !totalCost) {
    return <p>Something is wrong. Try again.</p>;
  }
  try {
    // Fetch extras and populate input with their availability
    // TODO setTimeout or reimplementation
    const extras = await fetchExtras();
    const availability = await fetchExtrasAvailability(startDate, endDate, extras);

    // Render the BookView component with necessary props
    return (
      <>
        <ConfirmBook
          vehicleId={carId}
          startDate={startDate}
          endDate={endDate}
          totalCost={totalCost}  // Pass base cost as a number
          extras={extras}
          availability={availability}
        />
      </>
    );
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return <p>Failed to load booking information. Please try again later.</p>;
  }
}
