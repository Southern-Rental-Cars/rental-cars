import React, { useEffect, useState } from 'react';
import Payments from './PaymentsView';
import { Vehicle } from '@/types/index';
import Loader from '@/components/Loader';
import { useUser } from '@/components/contexts/UserContext';
import { useRouter } from 'next/navigation';

interface PaymentDataProviderProps {
  vehicle: Vehicle;
  startDateTime: string;
  endDateTime: string;
  onBack: () => void;
}

const PaymentDataProvider: React.FC<PaymentDataProviderProps> = ({ vehicle, startDateTime, endDateTime, onBack }) => {
  const [availability, setAvailability] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    const validateAndFetch = async () => {
      if (!user) {
        alert('Please log in or create account to proceed');
        router.push('/login'); // Redirect to dashboard
        setLoading(false);
        return;
      }

      const { is_billing_complete, is_license_complete, phone } = user;

      const missingFields = [];
      if (!is_billing_complete) missingFields.push('Billing Address');
      if (!is_license_complete) missingFields.push('Driver’s License');
      if (!phone) missingFields.push('Phone Number');

      if (missingFields.length > 0) {
        alert(
          `Please complete the following before proceeding: ${missingFields.join(', ')}.`
        );
        router.push('/dashboard'); // Redirect to dashboard
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/extras/availability', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            start_date: startDateTime,
            end_date: endDateTime,
            extras: vehicle.extras,
          }),
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch availability');
        }

        const data = await response.json();
        setAvailability(data);
      } catch (error) {
        console.error('Error fetching availability:', error);
        alert('Failed to load booking data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    validateAndFetch();
  }, [user, startDateTime, endDateTime, vehicle.extras, router]);

  if (loading) {
    return <Loader />;
  }

  if (!availability) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <p>An error occurred. Please try again later.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          onClick={onBack}
        >
          Back to Details
        </button>
      </div>
    );
  }

  return (
    <Payments
      vehicle={vehicle}
      startDate={startDateTime}
      endDate={endDateTime}
      extras={vehicle.extras}
      availability={availability}
      onBack={onBack}
    />
  );
};

export default PaymentDataProvider;
