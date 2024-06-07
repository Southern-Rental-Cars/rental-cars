import Image from 'next/image'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Container } from '@/components/Container'
import Logo from '@/images/trclogo2.png'
import Link from 'next/link'
import Cross from '@/images/vehicles/cross.jpg'

const HomePage = () => {
  return (
    <Container className="mt-9">
      {/* Hero Section */}

      {/* Old logo */}
      {/* <section className="mb-12 flex flex-col items-center">
        <div className="relative mb-6 w-full md:w-1/2">
          <Image
            src={Logo}
            alt="Southern Rental Cars Logo"
            width={600}
            height={600}
            layout="responsive" // Ensure image scales well
          />
        </div>
      </section> */}

      {/* About Section */}
      <section className="mb-12">
        <p className="text-center text-base text-zinc-600 dark:text-zinc-400">
          At Southern Rental Cars, we believe that renting a car should be more than just a transaction – it should be an extension of your journey.
          That&apos;s why we offer a handpicked selection of quality vehicles, convenient delivery and pickup options throughout the Houston area, and personalized service that goes above and beyond.
          We&apos;re your trusted travel partner, dedicated to making your rental experience easy, convenient, and tailored to your individual needs.
        </p>
      </section>

      {/* Hero Image Section */}
      <section className="mb-12">
        <div className="relative w-full">
          <Image
            src={Cross}
            alt="Car on a scenic road"
            width={1920}
            height={1080}
            layout="responsive"
            priority
            className="rounded-xl"
          />
        </div>
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
