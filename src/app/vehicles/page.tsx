'use client'

import { useEffect, useState } from 'react';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { Card } from '@/components/Card';
import Vehicle from '@/lib/vehicle'

const VehiclePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch('/api/vehicles');
        const data: Vehicle[] = await response.json();
        setVehicles(data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    }
    fetchVehicles();
  }, []); // Empty dependency array ensures this runs only once on component mount

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.car_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container className="mt-9">
      <section className="mb-8">
        <div className="relative"> 
          <input 
            type="text"
            placeholder="Search for a make/model or year"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 px-4 pr-12 rounded-full border-gray-300 focus:outline-none focus:border-sky-500"
          />
          <button className="absolute inset-y-0 right-0 flex items-center px-4 rounded-r-full bg-sky-500 text-white">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
</svg>

          </button>
        </div>
      </section>

      <ul
        role="list"
        className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredVehicles.map((vehicle) => (
          <Link 
            href={`/vehicles/${vehicle.car_name}`} // Assuming you have an 'car_name' property for each vehicle
            key={vehicle.car_name}
            className="block" // Makes the entire card clickable
          > 
            <Card className="rounded-xl overflow-hidden shadow-md"> 
              {/* ... (Rest of the card content from VehicleList remains the same) */}
            </Card>
          </Link>
        ))}
      </ul>
    </Container>
  );
}

export default VehiclePage;