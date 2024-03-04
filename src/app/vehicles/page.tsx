import { type Metadata } from 'next'
import Image from 'next/image'

import { Card } from '@/components/Card'
import { SimpleLayout } from '@/components/SimpleLayout'
import Benz from '@/images/vehicles/car3.jpg'
import Atlas from '@/images/vehicles/atlas.jpg'
import Cross from '@/images/vehicles/cross.jpg'
import Whitetig from '@/images/vehicles/whitetig.jpg'
import Blacktig from '@/images/vehicles/blacktig.jpg'

const vehicles = [
  {
    name: '2023 Mercedes-Benz Metris',
    description:
      'The 8-passenger 2023 Mercedes-Benz Metris is a mid-size van that is perfect for transporting small groups or large cargo.',
    image: Benz,
    link: {
      label: 'Check availability',
      href: 'https://turo.com/us/en/minivan-rental/united-states/conroe-tx/mercedes-benz/metris/2575678',
    },
  },
  {
    name: '2024 Volkswagen Atlas',
    description:
      'VW`s largest SUV, the 2024 Volkswagen Atlas, is a spacious and comfortable 7-passenger vehicle that is perfect for long road trips and family vacations.',
    image: Atlas,
    link: {
      label: 'Check availability',
      href: 'https://turo.com/us/en/suv-rental/united-states/conroe-tx/volkswagen/atlas/2196188',
    },
  },
  {
    name: '2024 Volkswagen Atlas Cross Sport',
    description:
      'The 2024 Volkswagen Atlas Cross Sport is a 5-passenger SUV that is perfect for small families and couples.',
    image: Cross,
    link: {
      label: 'Check availability',
      href: 'https://turo.com/us/en/suv-rental/united-states/conroe-tx/volkswagen/atlas-cross-sport/2215467',
    },
  },
  {
    name: '2023 Volkswagen Tiguan',
    description:
      'The 7-passenger 2023 Volkswagen Tiguan is a compact SUV that is perfect for families and small groups.',
    image: Whitetig,
    link: {
      label: 'Check availability',
      href: 'https://turo.com/us/en/suv-rental/united-states/conroe-tx/volkswagen/tiguan/2088838',
    },
  },
  {
    name: '2022 Volkswagen Tiguan',
    description:
      'The 7-passenger 2022 Volkswagen Tiguan in all black is an SUV that is perfect for families and small groups.',
    image: Blacktig,
    link: {
      label: 'Check availability',
      href: 'https://turo.com/us/en/suv-rental/united-states/conroe-tx/volkswagen/tiguan/2049576',
    },
  },
  // {
  //   name: '2023 Mercedes-Benz Metris',
  //   description:
  //     'The 8-passenger 2023 Mercedes-Benz Metris is a mid-size van that is perfect for transporting small groups or large cargo. It is available in a variety of configurations, including passenger and cargo.',
  //   image: Benz,
  //   link: {
  //     label: 'Check availability',
  //     href: 'https://turo.com/us/en/minivan-rental/united-states/conroe-tx/mercedes-benz/metris/2575678',
  //   },
  // },
  // {
  //   name: '2023 Mercedes-Benz Metris',
  //   description:
  //     'The 8-passenger 2023 Mercedes-Benz Metris is a mid-size van that is perfect for transporting small groups or large cargo. It is available in a variety of configurations, including passenger and cargo.',
  //   image: Benz,
  //   link: {
  //     label: 'Check availability',
  //     href: 'https://turo.com/us/en/minivan-rental/united-states/conroe-tx/mercedes-benz/metris/2575678',
  //   },
  // },
  // {
  //   name: '2023 Mercedes-Benz Metris',
  //   description:
  //     'The 8-passenger 2023 Mercedes-Benz Metris is a mid-size van that is perfect for transporting small groups or large cargo. It is available in a variety of configurations, including passenger and cargo.',
  //   image: Benz,
  //   link: {
  //     label: 'Check availability',
  //     href: 'https://turo.com/us/en/minivan-rental/united-states/conroe-tx/mercedes-benz/metris/2575678',
  //   },
  // },
]

function LinkIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        d="M15.712 11.823a.75.75 0 1 0 1.06 1.06l-1.06-1.06Zm-4.95 1.768a.75.75 0 0 0 1.06-1.06l-1.06 1.06Zm-2.475-1.414a.75.75 0 1 0-1.06-1.06l1.06 1.06Zm4.95-1.768a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm3.359.53-.884.884 1.06 1.06.885-.883-1.061-1.06Zm-4.95-2.12 1.414-1.415L12 6.344l-1.415 1.413 1.061 1.061Zm0 3.535a2.5 2.5 0 0 1 0-3.536l-1.06-1.06a4 4 0 0 0 0 5.656l1.06-1.06Zm4.95-4.95a2.5 2.5 0 0 1 0 3.535L17.656 12a4 4 0 0 0 0-5.657l-1.06 1.06Zm1.06-1.06a4 4 0 0 0-5.656 0l1.06 1.06a2.5 2.5 0 0 1 3.536 0l1.06-1.06Zm-7.07 7.07.176.177 1.06-1.06-.176-.177-1.06 1.06Zm-3.183-.353.884-.884-1.06-1.06-.884.883 1.06 1.06Zm4.95 2.121-1.414 1.414 1.06 1.06 1.415-1.413-1.06-1.061Zm0-3.536a2.5 2.5 0 0 1 0 3.536l1.06 1.06a4 4 0 0 0 0-5.656l-1.06 1.06Zm-4.95 4.95a2.5 2.5 0 0 1 0-3.535L6.344 12a4 4 0 0 0 0 5.656l1.06-1.06Zm-1.06 1.06a4 4 0 0 0 5.657 0l-1.061-1.06a2.5 2.5 0 0 1-3.535 0l-1.061 1.06Zm7.07-7.07-.176-.177-1.06 1.06.176.178 1.06-1.061Z"
        fill="currentColor"
      />
    </svg>
  )
}

export const metadata: Metadata = {
  title: 'Vehicles',
  description:
    'We offer a wide range of vehicles for rent, including cars, trucks, and vans.',
}

export default function Vehicles() {
  return (
    <SimpleLayout
      title="Vehicles"
      intro="All of our vehicles are listed and available only through Turo, a popular online car rental platform. Select a vehicle to go directly to the booking page for pricing and availability."
    >
      <ul
        role="list"
        className="grid grid-cols-1 gap-x-12 gap-y-16 sm:grid-cols-2 lg:grid-cols-3"
      >
        {vehicles.map((vehicle) => (
          <Card as="li" key={vehicle.name}>
            <div className="flex justify-center">
              <Image
                src={vehicle.image}
                alt={vehicle.name}
                width={256}
                height={256}
                unoptimized
              />
            </div>
            <h2 className="mt-6 text-base font-semibold text-zinc-800 dark:text-zinc-100">
              <Card.Link href={vehicle.link.href}>{vehicle.name}</Card.Link>
            </h2>
            <Card.Description>{vehicle.description}</Card.Description>
            <p className="relative z-10 mt-6 flex text-sm font-medium text-zinc-400 transition group-hover:text-teal-500 dark:text-zinc-200">
              <LinkIcon className="h-6 w-6 flex-none" />
              <span className="ml-2">{vehicle.link.label}</span>
            </p>
          </Card>
        ))}
      </ul>
    </SimpleLayout>
  )
}
