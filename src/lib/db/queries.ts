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