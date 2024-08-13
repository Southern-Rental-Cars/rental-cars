'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useEffect } from 'react'
import { Card } from '@/components/Card'
import { Container } from '@/components/Container'

interface Car {
  car_name: string
  short_description: string
  image_url: string
  turo_url: string
  make: string
  model: string
  year: BigInteger
  type: string
}

export default function CarList({ searchQuery }: { searchQuery: string }) {
  const [cars, setCars] = useState<Car[]>([])
  const [filteredCars, setFilteredCars] = useState<Car[]>([])

  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch('/api/cars')
        const data: Car[] = await response.json()
        setCars(data)
        setFilteredCars(data) // Initialize filteredCars with all data
      } catch (error) {
        console.error('Error fetching cars:', error)
      }
    }
    fetchCars()
  }, [])

  useEffect(() => {
    // Filter cars based on search query
    const filtered = cars.filter((car) =>
      `${car.make} ${car.model} ${car.year} ${car.type}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    )
    setFilteredCars(filtered)
  }, [searchQuery, cars])

  return (
    <Container className="mb-12 mt-12">
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        {filteredCars.map((car, i) => (
          <Card key={i} className="overflow-hidden rounded-xl shadow-md">
            <div className="relative h-48 w-full">
              {' '}
              {/* Aspect ratio for images */}
              <img
                src={car.image_url}
                alt={car.car_name}
                className="h-full w-full rounded-t-xl object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between p-6">
              <h2 className="mb-2 text-lg font-semibold">
                {`${car.make} ${car.model} ${car.year}`}
              </h2>
              <p className="mb-4 text-gray-600">{car.short_description}</p>
              <a
                href={car.turo_url}
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
