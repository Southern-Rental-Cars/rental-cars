'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useEffect } from 'react'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'

interface Vehicle {
  car_name: string
  short_description: string
  image_url: string
  turo_url: string
}

export default function VehicleList({ searchQuery }: { searchQuery: string }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [filteredVehicles, setFilteredVehicles] = useState<Vehicle[]>([])

  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch('/api/vehicles')
        const data: Vehicle[] = await response.json()
        setVehicles(data)
        setFilteredVehicles(data) // Initialize filteredVehicles with all data
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      }
    }
    fetchVehicles()
  }, [])

  useEffect(() => {
    // Filter vehicles based on search query
    const filtered = vehicles.filter((vehicle) =>
      vehicle.car_name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredVehicles(filtered)
  }, [searchQuery, vehicles])

  return (
    <Container className="mb-12 mt-12">
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredVehicles.map((vehicle, i) => (
          <Card key={i} className="overflow-hidden rounded-xl shadow-md">
            <div className="relative h-48 w-full">
              {' '}
              {/* Aspect ratio for images */}
              <img
                src={vehicle.image_url}
                alt={vehicle.car_name}
                className="h-full w-full rounded-t-xl object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <h2 className="mb-2 text-lg font-semibold">{vehicle.car_name}</h2>
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
        ))}
      </ul>
    </Container>
  )
}
