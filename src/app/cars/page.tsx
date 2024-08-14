import CarList from './CarList';
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
}

async function fetchCars() {
  const baseURL = process.env.API_BASE_URL;
  const res = await fetch(`${baseURL}/api/cars`, {
    cache: 'no-store',
  });    

  if (!res.ok) {
    throw new Error('Failed to fetch cars');
  }

  return res.json();
}

export default async function CarPage() {
  const cars: Car[] = await fetchCars();

  return (
    <Container className="mt-9">
      <section className="mb-8">
        {/* Passing cars as props to the Client Component */}
        <CarList cars={cars} />
      </section>
    </Container>
  );
}
