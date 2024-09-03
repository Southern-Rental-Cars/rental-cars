import CarsView from '@/app/vehicles/components/View'; // Client Component
import { Container } from '@/components/Container';
import {Car} from '@/app/vehicles/types';
import { fetchCars } from "@/lib/db/queries";

export default async function Page() {
  const cars: Car[] = await fetchCars();
  return (
    <Container className="mt-9">
      <CarsView cars={cars} /> {/* Only pass the data */}
    </Container>
  );
}
