import React, { useEffect, useState, useCallback } from 'react';
import Payments from './PaymentsView';
import { Vehicle } from '@/types/index';
import Loader from '@/components/Loader';
import { useUser } from '@/components/contexts/UserContext';
import { useRouter } from 'next/navigation';

interface PaymentDataProviderProps {
  vehicle: Vehicle;
  startDateTime: string;
  endDateTime: string;
  cachedAvailability: any | null;
  setCachedAvailability: (data: any) => void;
  onBack: () => void;
}

interface AvailabilityResponse {
  extras: {
    id: number;
    name: string;
    available: boolean;
  }[];
}

const PaymentDataProvider: React.FC<PaymentDataProviderProps> = ({
  vehicle,
  startDateTime,
  endDateTime,
  cachedAvailability,
  setCachedAvailability,
  onBack,
}) => {
  const [availability, setAvailability] = useState<AvailabilityResponse | null>(cachedAvailability);
  const [loading, setLoading] = useState(!cachedAvailability);
  const { user } = useUser();
  const router = useRouter();

  // Validate user and ensure all required fields are completed
  const validateUser = useCallback((): boolean => {
    if (!user) {
      alert('Log in or create an account to proceed.');
      router.push('/login');
      return false;
    }

    const { is_billing_complete, is_license_complete, phone } = user;
    const missingFields = [];
    if (!is_billing_complete) missingFields.push('Billing Address');
    if (!is_license_complete) missingFields.push('Driver’s License');
    if (!phone) missingFields.push('Phone Number');

    if (missingFields.length > 0) {
      alert(`Please complete the following before proceeding: ${missingFields.join(', ')}.`);
      router.push('/dashboard');
      return false;
    }

    return true;
  }, [user, router]);

  // Fetch availability data
  const fetchAvailability = useCallback(async () => {
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
        throw new Error(`Failed to fetch extras availability: ${response.status}`);
      }

      const data: AvailabilityResponse = await response.json();
      setAvailability(data);
      setCachedAvailability(data); // Cache the fetched data
    } catch (error) {
      console.error('Error fetching extras availability:', error);
      alert('Failed to load extras availability data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [startDateTime, endDateTime, vehicle.extras, setCachedAvailability]);

  useEffect(() => {
    if (!validateUser()) {
      setLoading(false);
      return;
    }

    if (!cachedAvailability) {
      fetchAvailability();
    }
  }, [validateUser, cachedAvailability, fetchAvailability]);

  if (loading) {
    return <Loader />;
  }

  if (!availability) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
        <p>An error occurred. Please try again later.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onBack}
          aria-label="Go back to details"
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
