import { Vehicle } from "@/types";


// TO DO: fetch based on DateTime parameters
export async function fetchAvailabileVehicles(): Promise<Vehicle[]> {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
      console.error('API_BASE_URL is not set');
      throw new Error('API_BASE_URL is not set');
    }
    console.log(baseURL)
    const res = await fetch(`${baseURL}/api/vehicle`, {
      cache: 'no-store',
    });
  
    if (!res.ok) {
      console.error(res.statusText);
      throw new Error('Failed to fetch vehicles');
    }
  
    const data = await res.json();
  
    return data.map((vehicle: any) => ({
      ...vehicle,
      price: Number(vehicle.price),
    }));
  }

export async function fetchVehicleById(id: number): Promise<Vehicle | null> {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseURL) {
      console.error('NEXT_PUBLIC_API_BASE_URL is not cat');
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not cat');
    }
  
    const res = await fetch(`${baseURL}/api/vehicle/${id}`);
    if (!res.ok) {
      console.error(res.statusText);
      return null;
    }
  
    return res.json();
  }

export async function fetchExtras() {
  const baseURL = process.env.API_BASE_URL;
  const response = await fetch(`${baseURL}/api/extras`);
  if (!response.ok) {
    throw new Error('Failed to fetch extras');
  }
  return await response.json();
}

export async function fetchExtrasAvailability(startDate: string, endDate: string, extras: any[]) {
  const baseURL = process.env.API_BASE_URL;
  if (!startDate || !endDate) {
    throw new Error('Invalid dates provided for availability check.');
  }

  const response = await fetch(`${baseURL}/api/extras/availability`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      start_date: startDate,
      end_date: endDate,
      extras
    }),
    cache: 'no-store', // Disable caching temporarily
  });

  if (!response.ok) {
    throw new Error('Failed to fetch availability');
  }

  const responseData = await response.json();

  return responseData;
}

export async function createBooking(payload: any) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL; // accessed by server
  const response = await fetch(`${baseURL}/api/booking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to create booking');
  }

  const responseData = await response.json();
  return responseData;
}

export async function fetchBookingById(id: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Ensure baseURL is set
  if (!baseURL) {
    throw new Error('API base URL is not set in the environment variables');
  }

  try {
    const response = await fetch(`${baseURL}/api/booking/${id}`, {
      method: 'GET', // Explicitly setting the HTTP method
    });

    if (!response.ok) {
      // Try to extract and log the error message from the response body
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch booking: ${errorMessage}`);
    }

    const responseData = await response.json();
    return responseData;

  } catch (error: any) {
    // Catch and throw a more specific error message
    throw new Error(`An error occurred while fetching the booking: ${error.message}`);
  }
}




