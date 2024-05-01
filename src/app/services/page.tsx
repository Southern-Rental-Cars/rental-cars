import { Container } from '@/components/Container' // Assuming you have this component
import Link from 'next/link'

const ServicesPage = () => {
  return (
    <Container className="mt-16 sm:mt-32">
      <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
        Our Services
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-12">
        {/* Service 1: Delivery & Pickup */}
        <div>
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
            Delivery & Pickup
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            We offer convenient delivery and pickup services to and from:
          </p>
          <ul className="ml-6 mt-4 list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>IAH George Bush Intercontinental Airport</li>
            <li>The Woodlands</li>
            <li>Select hotels in The Woodlands and near the airport</li>
          </ul>
        </div>

        {/* Service 2: Shuttle & Driving Services */}
        <div>
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
            Shuttle & Driving Services
          </h2>
          <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
            Our fleet of Mercedes-Benz 8-passenger vans is ready to transport
            your group comfortably and stylishly. Ideal for:
          </p>
          <ul className="ml-6 mt-4 list-disc space-y-2 text-zinc-600 dark:text-zinc-400">
            <li>Proms</li>
            <li>Concerts</li>
            <li>VIP transport in The Woodlands area</li>
          </ul>
        </div>
      </div>

      {/* Call to Action */}
      <div className="mt-12">
        <h2 className="mb-4 text-center text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
          Ready to Book?
        </h2>
        <div className="text-center">
          <Link href="/contact">
            <button className="inline-block rounded-lg bg-[#00205A] px-6 py-3 font-medium text-white hover:bg-[#0050ba]">
              Contact Us
            </button>
          </Link>
        </div>
      </div>
    </Container>
  )
}

export default ServicesPage
