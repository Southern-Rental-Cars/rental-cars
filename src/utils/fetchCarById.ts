// utils/fetchCarById.ts
export async function fetchCarById(id: number) {
    try {
      const response = await fetch(`/api/vehicles/${id}`);
      if (!response.ok) {
        throw new Error(`Error fetching car with ID ${id}: ${response.statusText}`);
      }
      const car = await response.json();
      return car;
    } catch (error) {
      console.error('Error fetching car details:', error);
      return null;
    }
  }
  