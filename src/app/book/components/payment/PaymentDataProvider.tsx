import { useRouter } from 'next/navigation'; // Ensure correct router import
import React, { useEffect, useState } from 'react';
import Payments from './PaymentPage';
import { fetchAllExtras, fetchExtrasAvailability } from '@/lib/db/db';
import { isAuthenticated } from '@/lib/auth/auth'; // Import the isAuthenticated helper
import { Vehicle } from '@/types'; // Adjusted to use the correct Vehicle type
import Loader from '@/components/Loader';

interface PaymentDataProviderProps {
  vehicle: Vehicle;
  startDateTime: string;
  endDateTime: string;
  totalCost: number;
  onBackToDetails: () => void;
}

const PaymentDataProvider: React.FC<PaymentDataProviderProps> = ({
  vehicle,
  startDateTime,
  endDateTime,
  totalCost,
  onBackToDetails,
}) => {
  const [extras, setExtras] = useState<any[]>([]);
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
        const allExtras = await fetchAllExtras();
        setExtras(allExtras);

        const extrasAvailability = await fetchExtrasAvailability(startDateTime, endDateTime, allExtras);
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

  const vehicleDetails = {
    year: vehicle.year,
    gas_type: vehicle.gas_type,
    num_seats: vehicle.num_seats,
    num_doors: vehicle.num_doors,
    mpg: vehicle.mpg,
  };

  return (
    <Payments
      vehicleId={vehicle.id}
      vehicleName={`${vehicle.make} ${vehicle.model}`}
      vehicleDetails={vehicleDetails}
      startDate={startDateTime}
      endDate={endDateTime}
      basePrice={totalCost}
      extras={extras}
      availability={availability}
      onBackToDetails={onBackToDetails}
    />
  );
};

export default PaymentDataProvider;
