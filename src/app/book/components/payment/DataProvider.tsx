import { useRouter } from 'next/navigation'; // Ensure correct router import
import React, { useEffect, useState } from 'react';
import Payments from './page';
import { fetchExtrasAvailability } from '@/lib/db/db';
import { isAuthenticated } from '@/lib/auth/auth'; // Import the isAuthenticated helper
import { Vehicle } from '@/types/index'; // Adjusted to use the correct Vehicle type
import Loader from '@/components/Loader';
import { Extra } from '@prisma/client';

interface PaymentDataProviderProps {
  vehicle: Vehicle;
  startDateTime: string;
  endDateTime: string;
  subTotal: number;
  onBackToDetails: () => void;
}

const PaymentDataProvider: React.FC<PaymentDataProviderProps> = ({
  vehicle,
  startDateTime,
  endDateTime,
  subTotal,
  onBackToDetails,
}) => {
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter(); // Initialize router
  useEffect(() => {
    // Step 1: Check if the user is authenticated
    if (!isAuthenticated()) {
      router.push('/login'); // Redirect to login if not authenticated
      return;
    }

    // Step 2: Fetch data if authenticated
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
  }, [startDateTime, endDateTime, router]);

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
      subTotal={subTotal}
      extras={vehicle.extras}
      availability={availability}
      onBackToDetails={onBackToDetails}
    />
  );
};

export default PaymentDataProvider;
