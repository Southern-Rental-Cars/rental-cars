import { Container } from '@/components/Container';
import Link from 'next/link';
import Image from 'next/image';
import Benz from '@/images/vehicles/benz.jpg';
import Tig from '@/images/vehicles/blacktig.jpg';

const BusinessSolutionsPage = () => {
  return (
    <Container className="py-24 flex flex-col">
      <div className="mb-4 text-center">
        <Link href={'/business-solutions'}>
          <h1 className="text-5xl font-bold tracking-wide dark:text-zinc-100 mb-8">
            Business Solutions
          </h1>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
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
          <h2 className="text-2xl font-semibold mt-4">
            Corporate Travel
          </h2>
          <p className="mt-2">
            Streamline your business travel with us.
          </p>
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
          <h2 className="text-2xl font-semibold mt-4">
            Event Transportation
          </h2>
          <p className="mt-2">
            Ensure your guests arrive in style and on time for conferences, meetings, and special occasions.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Link href="/contact">
          <button className="bg-[#2f4269] text-white py-3 px-4 shadow-md hover:bg-blue-600 transition duration-300 ease-in-out inline-flex items-center">
            Free Quote
          </button>
        </Link>
      </div>
    </Container>
  );
}

export default BusinessSolutionsPage;
