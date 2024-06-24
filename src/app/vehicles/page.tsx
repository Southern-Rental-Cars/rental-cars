'use client'

import { useEffect, useState } from 'react';
import { Container } from '@/components/Container';
import Link from 'next/link';
import { Card } from '@/components/Card';
import Vehicle from '@/lib/vehicle'
import Image from 'next/image';

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
    <Container className="m-9 pt-6">
      <section className="m-8">
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
            href={`/vehicles/${vehicle.car_name}`} // Use vehicle.car_name for dynamic routing
            key={vehicle.car_name} // Use vehicle.id as the key
            className="block"
          > 
            <Card className="rounded-xl overflow-hidden shadow-md"> 
              <div className="relative h-48 w-full"> 
                <Image
                  src={vehicle.image_url}
                  alt={vehicle.car_name}
                  fill 
                  className="object-cover rounded-t-xl"
                />
              </div>
              <div className="flex flex-col justify-between p-6">
                <h2 className="mb-2 text-lg font-semibold">
                  {vehicle.make} {vehicle.model} {vehicle.year}
                </h2>
                <p className="mb-4 text-gray-600">{vehicle.short_description}</p>
                <a
                  href={vehicle.turo_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full rounded-md bg-sky-500 py-2 text-center text-white hover:bg-sky-600"
                >
                  Check Availability
                </a>
              </div>            
            </Card>
          </Link>
        ))}
      </ul>
    </Container>
  );
}

export default VehiclePage;