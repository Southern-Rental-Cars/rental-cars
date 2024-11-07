import React, { useEffect, useState } from 'react';
import Payments from './page';
import { Vehicle } from '@/types/index'; // Adjusted to use the correct Vehicle type
import Loader from '@/components/Loader';
import { useUser } from '@/components/contexts/UserContext';

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
  const { logout } = useUser();

  useEffect(() => {
    // Fetch data if authenticated
    const fetchData = async () => {
      try {
        const response = await fetch('/api/extras/availability', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            start_date: startDateTime,
            end_date: endDateTime,
            extras: vehicle.extras,
          }),
          credentials: 'include', // Ensures cookies are sent with the request
          cache: 'no-store',
        });
        if (response.status == 401) {
          logout();
        }
        const data = await response.json();
        setAvailability(data);
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
