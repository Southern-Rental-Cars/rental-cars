import FilterableCarList from './FilterableCarList'; // Client Component
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
}

async function fetchCars(): Promise<Car[]> {
  const baseURL = process.env.API_BASE_URL || 'http://localhost:3000';
  const res = await fetch(`${baseURL}/api/cars`, {
    cache: 'no-store',
  });

  if (!res.ok) {
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
      <FilterableCarList cars={cars} /> {/* Only pass the data */}
    </Container>
  );
}
