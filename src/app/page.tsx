import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import Vehicles from './vehicles/page'
import Link from 'next/link'

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
        <div className="mt-12">
          <button
            type="button"
            className={clsx(
              'inline-flex items-center justify-center rounded-md border border-transparent bg-teal-500 px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-600',
              'focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2',
            )}
          >
            <Link href="/vehicles">Check availability</Link>
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
          </button>

          <Vehicles />
        </div>
      </Container>
    </>
  )
}

export default Home
