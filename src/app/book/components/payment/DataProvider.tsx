import React, { useEffect, useState } from 'react';
import Payments from './page';
import { fetchExtrasAvailability } from '@/lib/db/db';
import { Vehicle } from '@/types/index'; // Adjusted to use the correct Vehicle type
import Loader from '@/components/Loader';
import { Extra } from '@prisma/client';

interface PaymentDataProviderProps {
  vehicle: Vehicle;
  startDateTime: string;
  endDateTime: string;
  onBackToDetails: () => void;
}

const PaymentDataProvider: React.FC<PaymentDataProviderProps> = ({
  vehicle,
  startDateTime,
  endDateTime,
  onBackToDetails,
}) => {
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch data if authenticated
    const fetchData = async () => {
      try {
        const extrasAvailability = await fetchExtrasAvailability(startDateTime, endDateTime, vehicle.extras);
        setAvailability(extrasAvailability);
      } catch (err: any) {
        console.error("Error fetching extras or availability: ", err);
        setError('Failed to load booking data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [startDateTime, endDateTime, vehicle.extras]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Payments
      vehicle={vehicle}
      startDate={startDateTime}
      endDate={endDateTime}
      extras={vehicle.extras}
      availability={availability || {}}
      onBackToDetails={onBackToDetails}
    />
  );
};

export default PaymentDataProvider;
