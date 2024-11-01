import { Vehicle, VehicleImages } from "@/types";

// Centralized fetch helper with automatic error handling
async function fetchWithToken(url: string, options: RequestInit = {}) {
  try {
    const res = await fetch(url, { ...options, credentials: 'include' }); // Ensure cookies are sent with each request

    if (!res.ok) {
      const errorMessage = await res.text();
      throw new Error(`Request failed: ${errorMessage}`);
    }

    return await res.json();
  } catch (error: any) {
    console.error(`Error during fetch: ${error.message}`);
    throw error;
  }
}

// Specific API methods

export async function fetchVehicles(): Promise<Vehicle[]> {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseURL) {
    console.error('NEXT_PUBLIC_API_BASE_URL is not set');
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
  }
  const data = await fetchWithToken(`${baseURL}/api/vehicle`, { cache: 'no-store' });
  return data.map((vehicle: any) => ({
    ...vehicle,
    price: Number(vehicle.price),
  }));
}

export async function fetchVehicleById(id: number): Promise<Vehicle | null> {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const data = await fetchWithToken(`${baseURL}/api/vehicle/${id}`);
  return data;
}

export async function fetchAllExtras() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return await fetchWithToken(`${baseURL}/api/extras`);
}

export async function fetchExtrasAvailability(startDate: string, endDate: string, extras: any[]) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!startDate || !endDate) {
    throw new Error('Invalid dates provided for availability check.');
  }
  
  return await fetchWithToken(`${baseURL}/api/extras/availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      start_date: startDate,
      end_date: endDate,
      extras,
    }),
    cache: 'no-store',
  });
}

export async function createBooking(payload: any) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return await fetchWithToken(`${baseURL}/api/booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}

export async function fetchBookingById(id: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return await fetchWithToken(`${baseURL}/api/booking/${id}`);
}

export async function fetchUserById(id: number) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return await fetchWithToken(`${baseURL}/api/user/${id}`);
}

export async function fetchImagesByVehicleId(vehicle_id: number): Promise<VehicleImages[] | null> {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return await fetchWithToken(`${baseURL}/api/vehicle_images/${vehicle_id}`);
}