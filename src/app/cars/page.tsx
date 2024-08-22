import CarsPageLayout from './CarPage'; // Client Component
import { Container } from '@/components/Container';

interface Car {
  car_name: string;
  short_description: string;
  image_url: string;
  turo_url: string;
  make: string;
  model: string;
  year: BigInteger;
  type: string;
  price: number;
  num_seats: number;
  num_doors: number;
}

async function fetchCars(): Promise<Car[]> {
  const baseURL = process.env.API_BASE_URL;
  console.log('API_BASE_URL:', baseURL);
  if (!baseURL) {
    console.error('API_BASE_URL is not set');
    throw new Error('API_BASE_URL is not set');
  }
  const res = await fetch(`${baseURL}/api/cars`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    console.error(res.statusText);
    throw new Error('Failed to fetch cars');
  }

  const data = await res.json();

  return data.map((car: any) => ({
    ...car,
    price: Number(car.price),
  }));
}

export default async function CarPage() {
  const cars: Car[] = await fetchCars();

  return (
    <Container className="mt-9">
      <CarsPageLayout cars={cars} /> {/* Only pass the data */}
    </Container>
  );
}
