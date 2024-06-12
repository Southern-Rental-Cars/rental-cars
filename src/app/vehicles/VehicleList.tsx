'use client'
import Image from 'next/image'
import { type Metadata } from 'next'
import { useEffect, useState } from 'react'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'

// Defining a interface Vehicle to describe the shape of the vehicle
interface Vehicle {
  car_name: string
  short_description: string
  image_url: string
}

export const metadata: Metadata = {
  title: 'Our Vehicles',
  description:
    'Browse our selection of vehicles for rent, including cars, trucks, and vans available for rent in The Woodlands, Texas and the greater Houston area.',
}

export default function VehicleList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])

  // Effect hook for fetching data
  useEffect(() => {
    // Asychronous function to fetch data
    async function fetchVehicles() {
      try {
        const response = await fetch('/api/vehicles') // Sneding a GET request to endpoint to retrieve vehicle data
        const data: Vehicle[] = await response.json() // Converts the response to JSON format
        setVehicles(data) // Updating the state of the array
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      }
    }
    fetchVehicles()
  }, [])

  return (
    <Container className="mb-12 mt-12">
      <div className="mb-6 mt-12 flex w-full flex-col">
        <h1 className="mb-6 text-center text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
          Our Vehicles
        </h1>
        <p className="mb-6 text-center text-base text-zinc-600 dark:text-zinc-400">
          Browse our selection of cars, trucks, and vans available for rent in
          The Woodlands, Texas and the greater Houston area.
        </p>
      </div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {vehicles.map((vehicle, i) => (
          <Card key={i}>
            <a
              className="flex justify-center overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105 hover:transform hover:shadow-lg"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Use img tag to display image */}
              <img
                src={vehicle.image_url}
                alt={vehicle.car_name}
                className="rounded-lg"
                style={{ width: '100%', height: 'auto' }}
              />
            </a>
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              {vehicle.car_name}
            </h2>
            <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
              {vehicle.short_description}
            </p>
            <div className="mt-6">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#00205A] px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 hover:ring-1 hover:ring-white focus:outline-none focus:ring-offset-2"
              >
                Check availability
                <svg
                  className="-mr-1 ml-2 h-6 w-6 flex-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </a>
            </div>
          </Card>
        ))}
      </ul>
    </Container>
  )
}
