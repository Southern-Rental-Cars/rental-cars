import React, { useEffect, useState } from 'react';
import Payments from './PaymentPage';
import { fetchAllExtras, fetchExtrasAvailability } from '@/lib/db/queries';
import { Vehicle } from '@/types'; // Import the actual type of Vehicle from your models
import Loader from '@/components/Loader';

interface PaymentDataProviderProps {
  vehicle: Vehicle; // Adjusted to use the correct Vehicle type
  startDateTime: string;
  endDateTime: string;
  totalCost: number;
  onBackToDetails: () => void; // Add the onBackToDetails prop
}

const PaymentDataProvider: React.FC<PaymentDataProviderProps> = ({
  vehicle,
  startDateTime,
  endDateTime,
  totalCost,
  onBackToDetails, // Destructure the new prop
}) => {
  const [extras, setExtras] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allExtras = await fetchAllExtras();
        setExtras(allExtras);
        const extrasAvailability = await fetchExtrasAvailability(startDateTime, endDateTime, allExtras);
        setAvailability(extrasAvailability);
      } catch (err) {
        setError('Failed to load booking data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [startDateTime, endDateTime]);

  if (loading) {
    return <Loader/>
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
      vehicleDetails={vehicleDetails} // Pass the vehicle details object
      startDate={startDateTime}
      endDate={endDateTime}
      basePrice={totalCost}
      extras={extras}
      availability={availability}
      onBackToDetails={onBackToDetails} // Pass the onBackToDetails prop to Payments
    />
  );
};

export default PaymentDataProvider;
