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

      <VehicleList searchQuery={searchQuery} />
    </Container>
  );
}

export default VehiclePage
