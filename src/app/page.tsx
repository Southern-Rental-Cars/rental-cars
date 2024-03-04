import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import image1 from '@/images/vehicles/car1.jpg'
import image2 from '@/images/vehicles/car2.jpg'
import image3 from '@/images/vehicles/car3.jpg'
import image4 from '@/images/vehicles/car4.jpg'
import image5 from '@/images/vehicles/car5.jpg'
import Vehicles from './vehicles/page'

const Home = async () => {
  return (
    <>
      <Container className="mt-9">
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            Texas Rental Cars
          </h1>
          <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
            Texas Rental Cars LLC is located in The Woodlands, Texas. We offer a
            wide range of vehicles for rent, including cars, trucks, and vans.
          </p>
        </div>
      </Container>
      <Vehicles />
    </>
  )
}

export default Home
