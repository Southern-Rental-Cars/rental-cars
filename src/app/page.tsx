import Image, { type ImageProps } from 'next/image'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import Link from 'next/link'
import Logo from '@/images/trclogo2.png'

const Home = async () => {
  return (
    <>
      <Container className="mt-9">
        <div className="mb-6 mt-24 flex w-full justify-center rounded-full bg-white p-2">
          <Image
            src={Logo}
            alt="Texas Rental Cars"
            width={600}
            height={600}
            unoptimized
          />
        </div>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          Texas Rental Cars LLC is located in The Woodlands, Texas. We offer a
          wide range of vehicles for rent, including cars, trucks, and vans.
        </p>
        <div className="mt-12">
          <button
            type="button"
            className={clsx(
              'inline-flex items-center justify-center rounded-md border border-transparent bg-[#00205A] px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700',
              'focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-offset-2',
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
        </div>
      </Container>
    </>
  )
}

export default Home
