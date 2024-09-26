import React from 'react';
import BookView from './components/View';
import { fetchExtras, fetchAvailability } from '@/lib/db/queries';

interface SearchParams {
  carId: string;
  startDate: string;
  endDate: string;
  totalCost: string;
}

export default async function BookPage({ searchParams }: { searchParams: SearchParams }) {
  const { carId, startDate, endDate, totalCost } = searchParams;

  // Validate required booking information
  if (!carId || !startDate || !endDate || !totalCost) {
    return <p>Missing required booking information.</p>;
  }

  try {
    // Fetch extras and their availability for the selected dates
    const extras = await fetchExtras();
    const availability = await fetchAvailability(startDate, endDate, extras);

    // Render the BookView component with necessary props
    return (
      <BookView
        carId={carId}
        startDate={startDate}
        endDate={endDate}
        totalCost={parseFloat(totalCost)}  // Pass base cost as a number
        extras={extras}
        availability={availability}
      />
    );
  } catch (error) {
    console.error('Error fetching booking data:', error);
    return <p>Failed to load booking information. Please try again later.</p>;
  }
}
