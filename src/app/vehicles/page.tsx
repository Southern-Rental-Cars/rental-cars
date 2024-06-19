'use client'
import { useState } from 'react';
import VehicleList from '@/app/vehicles/VehicleList';
import { Container } from '@/components/Container';
import Image from 'next/image';

const VehiclePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Container className="mt-9">
      <section className="mb-8">
        <div className="relative"> 
          <input 
            type="text"
            placeholder="Where are you going?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 px-4 pr-12 rounded-full border-gray-300 focus:outline-none focus:border-sky-500"
          />
          <button className="absolute inset-y-0 right-0 flex items-center px-4 rounded-r-full bg-sky-500 text-white">
            <Image src="/search-icon.svg" alt="Search Icon" width={20} height={20} /> 
          </button>
        </div>
      </section>

      <VehicleList searchQuery={searchQuery} />
    </Container>
  );
}

export default VehiclePage
