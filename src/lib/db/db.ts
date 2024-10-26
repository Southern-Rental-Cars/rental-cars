import { Vehicle } from "@/types";
import Cookies from 'js-cookie';  // Import the library to access cookies

// Helper function to get the JWT token from cookies
function getToken() {
  return Cookies.get('token'); // Assuming the token is stored in a cookie named 'token'
}

export async function fetchAvailableVehicles(): Promise<Vehicle[]> {
    const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL; // Ensure this is set correctly
    if (!baseURL) {
      console.error('NEXT_PUBLIC_API_BASE_URL is not set');
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
    }

    const token = getToken(); // Get the JWT token

    const res = await fetch(`${baseURL}/api/vehicle`, {
      cache: 'no-store',
      headers: {
        'Authorization': `Bearer ${token}` // Include the Authorization header
      }
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
      console.error('NEXT_PUBLIC_API_BASE_URL is not set');
      throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
    }

    const token = getToken(); // Get the JWT token

    const res = await fetch(`${baseURL}/api/vehicle/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}` // Include the Authorization header
      }
    });
    if (!res.ok) {
      console.error(res.statusText);
      return null;
    }
    return res.json();
}

export async function fetchAllExtras() {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const token = getToken(); // Get the JWT token

  const response = await fetch(`${baseURL}/api/extras`, {
    headers: {
      'Authorization': `Bearer ${token}` // Include the Authorization header
    }
  });
  if (!response.ok) {
    throw new Error('Failed to fetch extras');
  }
  return await response.json();
}

export async function fetchExtrasAvailability(startDate: string, endDate: string, extras: any[]) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!startDate || !endDate) {
    throw new Error('Invalid dates provided for availability check.');
  }

  const token = getToken(); // Get the JWT token

  const response = await fetch(`${baseURL}/api/extras/availability`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` // Include the Authorization header
    },
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

  const token = getToken(); 

  const response = await fetch(`${baseURL}/api/booking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
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
  if (!baseURL) {
    throw new Error('API base URL is not set in the environment variables');
  }

  const token = getToken();

  try {
    const response = await fetch(`${baseURL}/api/booking/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
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

export async function fetchUserById(id: number) {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseURL) {
    throw new Error('API base URL is not set in the environment variables');
  }

  const token = getToken(); // Get the JWT token

  try {
    const response = await fetch(`${baseURL}/api/user/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      // Log and throw a descriptive error message if the request fails
      const errorMessage = await response.text();
      throw new Error(`Failed to fetch user: ${errorMessage}`);
    }
    
    // Parse and return the response JSON data
    const userData = await response.json();
    return userData;
  } catch (error: any) {
    // Catch and throw a more specific error message if an error occurs
    throw new Error(`An error occurred while fetching the user: ${error.message}`);
  }
}

