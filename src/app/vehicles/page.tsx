import { Users, Car, Gauge } from 'lucide-react'
import Image from 'next/image'
import Atlas from '@/images/vehicles/atlas2024.jpg'
import Cross from '@/images/vehicles/cross.jpg'
import Bronco from '@/images/vehicles/bronco.jpg'
import C_Class from '@/images/vehicles/c_class2019.jpg'
import metris2018 from '@/images/vehicles/metris2018.png'
import metris2023 from '@/images/vehicles/benz.jpg'
import camry from '@/images/vehicles/camry.jpg'
import taos from '@/images/vehicles/taos.jpg'
import tiguan2022 from '@/images/vehicles/tiguan2022.jpg'
import tiguan2023 from '@/images/vehicles/tiguan2023.jpg'

// Car data array
const vehicles = [
  {
    id: 1,
    name: 'Ford Bronco Sport 2023',
    image: Bronco,
    url: 'https://turo.com/us/en/suv-rental/united-states/the-woodlands-tx/ford/bronco-sport/2199606',
    pricePerDay: 75,
    features: {
      passengers: 5,
      transmission: 'Automatic',
      fuelType: 'Gas (Regular)',
    },
  },
  // {
  //   id: 2,
  //   name: 'Mercedes-Benz C-Class 2019',
  //   image: C_Class,
  //   url: 'https://turo.com/us/en/car-rental/united-states/the-woodlands-tx/mercedes-benz/c-class/2836080',
  //   pricePerDay: 75,
  //   features: {
  //     passengers: 5,
  //     transmission: 'Automatic',
  //     fuelType: 'Gas (Premium)',
  //   },
  // },
  {
    id: 3,
    name: 'Mercedes-Benz Metris 2018',
    image: metris2018,
    url: 'https://turo.com/us/en/minivan-rental/united-states/the-woodlands-tx/mercedes-benz/metris/2864883',
    pricePerDay: 100,
    features: {
      passengers: 8,
      transmission: 'Automatic',
      fuelType: 'Gas (Premium)',
    },
  },
  {
    id: 4,
    name: 'Mercedes-Benz Metris 2023',
    image: metris2023,
    url: 'https://turo.com/us/en/minivan-rental/united-states/the-woodlands-tx/mercedes-benz/metris/2575678',
    pricePerDay: 100,
    features: {
      passengers: 8,
      transmission: 'Automatic',
      fuelType: 'Gas (Premium)',
    },
  },
  // {
  //   id: 5,
  //   name: 'Toyota Camry 2024',
  //   image: camry,
  //   url: 'https://turo.com/us/en/car-rental/united-states/the-woodlands-tx/toyota/camry/2514583',
  //   pricePerDay: 70,
  //   features: {
  //     passengers: 5,
  //     transmission: 'Automatic',
  //     fuelType: 'Gas (Regular)',
  //     mpg: 34,
  //   },
  // },
  {
    id: 6,
    name: 'Volkswagen Atlas 2024',
    image: Atlas,
    url: 'https://turo.com/us/en/suv-rental/united-states/the-woodlands-tx/volkswagen/atlas/2196188',
    pricePerDay: 80,
    features: {
      passengers: 7,
      transmission: 'Automatic',
      fuelType: 'Gas (Regular)',
    },
  },
  {
    id: 7,
    name: 'Volkswagen Atlas Cross-sport 2024',
    image: Cross,
    url: 'https://turo.com/us/en/suv-rental/united-states/the-woodlands-tx/volkswagen/atlas-cross-sport/2215467',
    pricePerDay: 75,
    features: {
      passengers: 5,
      transmission: 'Automatic',
      fuelType: 'Gas (Regular)',
    },
  },
  {
    id: 8,
    name: 'Volkswagen Taos 2023',
    image: taos,
    url: 'https://turo.com/us/en/suv-rental/united-states/the-woodlands-tx/volkswagen/taos/2043218',
    pricePerDay: 75,
    features: {
      passengers: 5,
      transmission: 'Automatic',
      fuelType: 'Gas (Regular)',
      mpg: 32,
    },
  },
  {
    id: 9,
    name: 'Volkswagen Tiguan 2022',
    image: tiguan2022,
    url: 'https://turo.com/us/en/suv-rental/united-states/the-woodlands-tx/volkswagen/tiguan/2049576',
    pricePerDay: 75,
    features: {
      passengers: 7,
      transmission: 'Automatic',
      fuelType: 'Gas (Regular)',
      mpg: 26,
    },
  },
  {
    id: 10,
    name: 'Volkswagen Tiguan 2023',
    image: tiguan2023,
    url: 'https://turo.com/us/en/suv-rental/united-states/the-woodlands-tx/volkswagen/tiguan/2088838',
    pricePerDay: 75,
    features: {
      passengers: 7,
      transmission: 'Automatic',
      fuelType: 'Gas (Regular)',
      mpg: 26,
    },
  },
]

export default function Page() {
  return (
    <div className="container mx-auto mt-9 px-4">
      <h1 className="mb-10 text-center text-3xl font-bold">Browse Vehicles</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
          >
            <a
              href={vehicle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                className="h-48 w-full object-cover"
              />
            </a>

            <div className="p-5">
              <a
                href={vehicle.url}
                target="_blank"
                rel="noopener noreferrer"
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
                >
                  Reserve Online
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
