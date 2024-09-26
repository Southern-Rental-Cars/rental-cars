import { Car } from "@/app/vehicles/types";

export async function fetchCars(): Promise<Car[]> {
    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
      console.error('API_BASE_URL is not set');
      throw new Error('API_BASE_URL is not set');
    }
    const res = await fetch(`${baseURL}/api/vehicles`, {
      cache: 'no-store',
    });
  
    if (!res.ok) {
      console.error(res.statusText);
      throw new Error('Failed to fetch vehicles');
    }
  
    const data = await res.json();
  
    return data.map((car: any) => ({
      ...car,
      price: Number(car.price),
    }));
  }

export async function fetchCarById(id: number): Promise<Car | null> {

    const baseURL = process.env.API_BASE_URL;
    if (!baseURL) {
      console.error('API_BASE_URL is not set');
      throw new Error('API_BASE_URL is not set');
    }
  
    const res = await fetch(`${baseURL}/api/vehicles/${id}`);
   
    if (!res.ok) {
      console.error(res.statusText);
      return null;
    }
  
    return res.json();
  }

  // lib/fetchExtras.js

export async function fetchExtras() {
  const baseURL = process.env.API_BASE_URL;
  const response = await fetch(`${baseURL}/api/extras`);
  if (!response.ok) {
    throw new Error('Failed to fetch extras');
  }
  return await response.json();
}

export async function fetchAvailability(startDate: string, endDate: string, extras: any[]) {
  const baseURL = process.env.API_BASE_URL;

  // Log the data being sent
  console.log('Sending availability check:', {
    start_date: startDate,
    end_date: endDate,
    extras
  });

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
  console.log('API Response:', responseData);

  return responseData;
}



