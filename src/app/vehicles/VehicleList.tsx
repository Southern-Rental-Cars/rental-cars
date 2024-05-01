import { type Metadata } from 'next'
import Image from 'next/image'

import { Card } from '@/components/Card'
import Benz from '@/images/vehicles/benz.jpg'
import Atlas from '@/images/vehicles/atlas.jpg'
import Cross from '@/images/vehicles/cross.jpg'
import Whitetig from '@/images/vehicles/whitetig.jpg'
import Blacktig from '@/images/vehicles/blacktig.jpg'
import Taos from '@/images/vehicles/taos.jpg'
import Camry from '@/images/vehicles/camry.jpg'
import Bronco from '@/images/vehicles/bronco.jpg'
import { Container } from '@/components/Container'

const vehicles = [
  {
    name: '2023 Mercedes-Benz Metris',
    description:
      'The 8-passenger 2023 Mercedes-Benz Metris is a mid-size van that is perfect for transporting small groups or large cargo.',
    image: Benz,
    link: {
      href: 'https://turo.com/us/en/minivan-rental/united-states/conroe-tx/mercedes-benz/metris/2575678',
    },
  },
  {
    name: '2024 Volkswagen Atlas',
    description:
      'VW`s largest SUV, the 2024 Volkswagen Atlas, is a spacious and comfortable 7-passenger vehicle that is perfect for long road trips and family vacations.',
    image: Atlas,
    link: {
      href: 'https://turo.com/us/en/suv-rental/united-states/conroe-tx/volkswagen/atlas/2196188',
    },
  },
  {
    name: '2024 Volkswagen Atlas Cross Sport',
    description:
      'The 2024 Volkswagen Atlas Cross Sport is a 5-passenger SUV that is perfect for small families and couples.',
    image: Cross,
    link: {
      href: 'https://turo.com/us/en/suv-rental/united-states/conroe-tx/volkswagen/atlas-cross-sport/2215467',
    },
  },
  {
    name: '2023 Volkswagen Tiguan',
    description:
      'The 7-passenger 2023 Volkswagen Tiguan is a compact SUV that is perfect for families and small groups.',
    image: Whitetig,
    link: {
      href: 'https://turo.com/us/en/suv-rental/united-states/conroe-tx/volkswagen/tiguan/2088838',
    },
  },
  {
    name: '2022 Volkswagen Tiguan',
    description:
      'The 7-passenger 2022 Volkswagen Tiguan in all black is an SUV that is perfect for families and small groups.',
    image: Blacktig,
    link: {
      href: 'https://turo.com/us/en/suv-rental/united-states/conroe-tx/volkswagen/tiguan/2049576',
    },
  },
  {
    name: '2023 Volkswagen Taos',
    description:
      'The 2023 Volkswagen Taos is a compact SUV that is perfect for small families and couples.',
    image: Taos,
    link: {
      href: 'https://turo.com/us/en/suv-rental/united-states/conroe-tx/volkswagen/taos/2043218',
    },
  },
  {
    name: '2024 Toyota Camry',
    description:
      'The 2024 Toyota Camry is a mid-size sedan that is perfect for small families and couples.',
    image: Camry,
    link: {
      href: 'https://turo.com/us/en/car-rental/united-states/conroe-tx/toyota/camry/2514583',
    },
  },
  {
    name: '2023 Ford Bronco Sport',
    description:
      'The world-famous 2023 Ford Bronco Sport is a compact SUV that is perfect for small families and couples.',
    image: Bronco,
    link: {
      href: 'https://turo.com/us/en/suv-rental/united-states/conroe-tx/ford/bronco-sport/2199606',
    },
  },
]

export const metadata: Metadata = {
  title: 'Our Vehicles',
  description:
    'Browse our selection of vehicles for rent, including cars, trucks, and vans available for rent in The Woodlands, Texas and the greater Houston area.',
}

export default function VehicleList() {
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
              href={vehicle.link.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* Handle potential image loading errors */}
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                width={500}
                height={500}
                unoptimized
                className="rounded-lg"
              />
            </a>
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              <Card.Link href={vehicle.link.href}>{vehicle.name}</Card.Link>
            </h2>
            <Card.Description>{vehicle.description}</Card.Description>

            <div className="mt-6">
              <a
                href={vehicle.link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-[#00205A]
                 px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 hover:ring-1
                  hover:ring-white focus:outline-none focus:ring-offset-2"
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
