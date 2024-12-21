import { Container } from '@/components/Container'
import Link from 'next/link'
import Image from 'next/image'
import Benz from '@/images/vehicles/metris2018.png'
import Tig from '@/images/vehicles/tiguan2022.jpg'

const BusinessSolutionsPage = () => {
  return (
    <Container className="mt-10 flex flex-col">
      <div className="mb-4 text-center">
        <Link href={'/business-solutions'}>
          <h1 className="mb-8 text-5xl font-bold tracking-wide dark:text-zinc-100">
            Business solutions
          </h1>
        </Link>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Service 1: Corporate Travel */}
        <div className="flex flex-col items-center text-center">
          <Image
            src={Tig}
            alt="Corporate Travel"
            width={400}
            height={250}
            className="rounded-lg shadow-md"
            priority // Ensure this image loads as soon as possible
          />
          <h2 className="mt-4 text-2xl font-semibold">Corporate Travel</h2>
          <p className="mt-2">Streamline your business travel with us.</p>
        </div>

        {/* Service 2: Event Transportation */}
        <div className="flex flex-col items-center text-center">
          <Image
            src={Benz}
            alt="Event Transportation"
            width={400}
            height={250}
            className="rounded-lg shadow-md"
            loading="lazy" // Lazily load this image as it is not the LCP element
          />
          <h2 className="mt-4 text-2xl font-semibold">Event Transportation</h2>
          <p className="mt-2">
            Ensure your guests arrive in style and on time for conferences,
            meetings, and special occasions.
          </p>
        </div>
      </div>
      <hr className="mb-8 w-full border-t border-gray-300" />
      {/* Call to Action */}
      <div className="text-center">
        <Link href="/contact">
          <button className="inline-flex items-center bg-[#2f4269] px-4 py-3 text-white shadow-md transition duration-300 ease-in-out hover:bg-blue-600">
            Free Quote
          </button>
        </Link>
      </div>
    </Container>
  )
}

export default BusinessSolutionsPage
