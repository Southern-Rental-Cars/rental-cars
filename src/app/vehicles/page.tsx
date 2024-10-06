import Vehicles from '@/app/vehicles/components/View'; // Client Component
import { Container } from '@/components/Container';
import {Car} from '@/types';
import { fetchVehicles } from "@/lib/db/queries";

export default async function VehiclesPage() {
  const cars: Car[] = await fetchVehicles();
  return (
    <Container className="mt-9">
      <Vehicles cars={cars} /> {/* Only pass the data */}
    </Container>
  );
}
