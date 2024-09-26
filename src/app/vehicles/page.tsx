import VehiclesView from '@/app/vehicles/components/View'; // Client Component
import { Container } from '@/components/Container';
import {Car} from '@/app/vehicles/types';
import { fetchCars } from "@/lib/db/queries";

export default async function VehiclesPage() {
  const cars: Car[] = await fetchCars();
  return (
    <Container className="mt-9">
      <VehiclesView cars={cars} /> {/* Only pass the data */}
    </Container>
  );
}
