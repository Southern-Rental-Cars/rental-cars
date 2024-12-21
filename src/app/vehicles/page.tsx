import { Users, Car, Gauge } from 'lucide-react'
import { Atlas } from '@/images/vehicles/atlas.jpg'
import { Cross } from '@/images/vehicles/cross.jpg'
// import { Atlas } from '@/images/vehicles/atlas.jpg'
// import { Atlas } from '@/images/vehicles/atlas.jpg'
// import { Atlas } from '@/images/vehicles/atlas.jpg'
// import { Atlas } from '@/images/vehicles/atlas.jpg'
// import { Atlas } from '@/images/vehicles/atlas.jpg'
// import { Atlas } from '@/images/vehicles/atlas.jpg'
// import { Atlas } from '@/images/vehicles/atlas.jpg'

// Car data array
const vehicles = [
  {
    id: 1,
    name: 'Volkswagen Atlas',
    image: Atlas,
    url: 'https://turo.com/us/en/suv-rental/united-states/the-woodlands-tx/volkswagen/atlas/2196188',
    pricePerDay: 80,
    features: {
      passengers: 7,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
    },
  },
  {
    id: 2,
    name: 'Volkswagen Atlas Cross-sport',
    image: Cross,
    url: 'https://turo.com/us/en/suv-rental/united-states/the-woodlands-tx/volkswagen/atlas-cross-sport/2215467',
    pricePerDay: 75,
    features: {
      passengers: 5,
      transmission: 'Automatic',
      fuelType: 'Gasoline',
    },
  },
  // {
  //   id: 3,
  //   name: 'Luxury Sedan',
  //   imageUrl: '/api/placeholder/300/200',
  //   pricePerDay: 79,
  //   features: {
  //     passengers: 4,
  //     transmission: 'Automatic',
  //     fuelType: 'Premium',
  //   },
  // },
  // {
  //   id: 4,
  //   name: 'Economy Hatchback',
  //   imageUrl: '/api/placeholder/300/200',
  //   pricePerDay: 35,
  //   features: {
  //     passengers: 4,
  //     transmission: 'Manual',
  //     fuelType: 'Regular',
  //   },
  // },
  // {
  //   id: 5,
  //   name: 'Large SUV',
  //   imageUrl: '/api/placeholder/300/200',
  //   pricePerDay: 69,
  //   features: {
  //     passengers: 7,
  //     transmission: 'Automatic',
  //     fuelType: 'Diesel',
  //   },
  // },
  // {
  //   id: 6,
  //   name: 'Sports Coupe',
  //   imageUrl: '/api/placeholder/300/200',
  //   pricePerDay: 89,
  //   features: {
  //     passengers: 2,
  //     transmission: 'Automatic',
  //     fuelType: 'Premium',
  //   },
  // },
  // {
  //   id: 7,
  //   name: 'Electric Compact',
  //   imageUrl: '/api/placeholder/300/200',
  //   pricePerDay: 49,
  //   features: {
  //     passengers: 4,
  //     transmission: 'Automatic',
  //     fuelType: 'Electric',
  //   },
  // },
  // {
  //   id: 8,
  //   name: 'Minivan',
  //   imageUrl: '/api/placeholder/300/200',
  //   pricePerDay: 65,
  //   features: {
  //     passengers: 7,
  //     transmission: 'Automatic',
  //     fuelType: 'Gasoline',
  //   },
  // },
  // {
  //   id: 9,
  //   name: 'Crossover',
  //   imageUrl: '/api/placeholder/300/200',
  //   pricePerDay: 55,
  //   features: {
  //     passengers: 5,
  //     transmission: 'Automatic',
  //     fuelType: 'Hybrid',
  //   },
  // },
  // {
  //   id: 10,
  //   name: 'Convertible',
  //   imageUrl: '/api/placeholder/300/200',
  //   pricePerDay: 95,
  //   features: {
  //     passengers: 2,
  //     transmission: 'Automatic',
  //     fuelType: 'Premium',
  //   },
  // },
]

export default function Page() {
  return (
    <div className="container mx-auto mt-9 px-4">
      <h1 className="mb-10 text-center text-3xl font-bold">
        Our Car Rental Fleet
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
          >
            <a href={vehicle.url} className="block">
              <img
                src={vehicle.imageUrl}
                alt={vehicle.name}
                className="h-48 w-full object-cover"
              />
            </a>

            <div className="p-5">
              <a
                href={vehicle.url}
                className="block transition-colors hover:text-blue-600"
              >
                <h2 className="mb-2 text-xl font-semibold">{vehicle.name}</h2>
              </a>

              <div className="mb-4 flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">
                  ${vehicle.pricePerDay}/day
                </span>
                <a
                  href={vehicle.url}
                  className="inline-block rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  Reserve
                </a>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  {vehicle.features.passengers} Passengers
                </div>
                <div className="flex items-center">
                  <Car className="mr-2 h-4 w-4" />
                  {vehicle.features.transmission}
                </div>
                <div className="flex items-center">
                  <Gauge className="mr-2 h-4 w-4" />
                  {vehicle.features.fuelType}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
