import { Vehicle, VehicleImages } from "@/types";

// utils/db/db.ts
async function fetchWithToken(url: string, token?: string) {
  try {
    const res = await fetch(url, {
      headers: {
        ...(token ? { Cookie: `token=${token}` } : {}),
      },
      credentials: 'include',
    });
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
export async function fetchAvailableVehicles(startDate: string, endDate: string) {
  return await fetchWithToken(`/api/vehicle?start=${startDate}&end=${endDate}`);
}


export async function fetchVehicleById(id: number): Promise<Vehicle | null> {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return await fetchWithToken(`/api/vehicle/${id}`);
}

export async function fetchImagesByVehicleId(vehicle_id: number): Promise<VehicleImages[] | null> {
  return await fetchWithToken(`/api/vehicle_images/${vehicle_id}`);
}

export async function fetchBookingById(id: string, token?: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return await fetchWithToken(`/api/booking/${id}`, token);
}

export async function fetchUserById(token?: string) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  return await fetchWithToken(`/api/user`, token);
}