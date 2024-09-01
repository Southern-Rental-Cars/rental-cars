import { Container } from '@/components/Container';
import Link from 'next/link';
import Image from 'next/image';
import Benz from '@/images/vehicles/benz.jpg';
import Tig from '@/images/vehicles/blacktig.jpg';

const BusinessSolutionsPage = () => {
  return (
    <Container className='py-24'>
      <div className="mb-4">
        <Link href={'/business-solutions'}>
        <h1 className="text-center text-4xl font-bold tracking-wide sm:text-5xl dark:text-zinc-100 mb-4">
          Business Solutions
        </h1>
        </Link>
        <p className="text-center text-lg md:text-xl tracking-wide mb-8">
          Schedule transportation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Service 1: Corporate Travel */}
        <div className="flex flex-col">
          <Image 
            src={Tig}
            alt="Corporate Travel"
            width={400} 
            height={250} 
            className="rounded-lg shadow-md"
            priority // Ensure this image loads as soon as possible
          />
          <h2 className="text-left text-2xl font-semibold mt-4">
            Corporate Travel
          </h2>
          <p className="text-left mt-2">
            Streamline your business travel with us.
          </p>
        </div>

        {/* Service 2: Event Transportation */}
        <div className="flex flex-col">
          <Image 
            src={Benz}
            alt="Event Transportation"
            width={400} 
            height={250} 
            className="rounded-lg shadow-md"
            loading="lazy" // Lazily load this image as it is not the LCP element
          />
          <h2 className="text-left text-2xl font-semibold mt-4">
            Event Transportation
          </h2>
          <p className="text-left mt-2">
            Ensure your guests arrive in style and on time for conferences, meetings, and special occasions.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <p className="text-lg font-semibold mb-4">
          Get accomodated service.
        </p>
        <Link href="/contact">
          <button className="bg-[#2f4269] text-white py-3 px-6 rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out inline-flex items-center">
            Free Quote
          </button>
        </Link>
      </div>
    </Container>
  );
}

export default BusinessSolutionsPage;
