import Image from 'next/image'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Container } from '@/components/Container'
import Logo from '@/images/trclogo2.png'
import Link from 'next/link'

const HomePage = () => {
  return (
    <Container className="mt-9">
      {/* Hero Section */}
      <section className="mb-12 flex flex-col items-center">
        <div className="relative mb-6 w-full md:w-1/2">
          <Image
            src={Logo}
            alt="Texas Rental Cars Logo"
            width={600}
            height={600}
            layout="responsive" // Ensure image scales well
            priority // Prioritize loading for good user experience
          />
        </div>
      </section>

      {/* About Section */}
      <section className="mb-12">
        <p className="text-center text-base text-zinc-600 dark:text-zinc-400">
          Texas Rental Cars LLC is a family-owned and operated car rental
          company based in The Woodlands, Texas. We offer a wide range of
          vehicles for rent, delivery, and pick-up in the greater Houston area.
          We strive to provide exceptional customer service and competitive
          pricing to make your rental experience easy and convenient.
        </p>
      </section>

      {/* Call to Action */}
      <section>
        <h2 className="mb-4 text-center text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
          Ready to Rent?
        </h2>
        <div className="text-center">
          <Link
            href="/vehicles"
            className="inline-flex items-center rounded-lg bg-[#00205A] px-6 py-3 font-medium text-white hover:bg-[#0050ba]"
          >
            Browse Our Vehicles <ChevronRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </Container>
  )
}

export default HomePage
