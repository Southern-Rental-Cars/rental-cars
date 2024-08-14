import { Container } from '@/components/Container';
import Link from 'next/link';
import Image from 'next/image';
import Benz from '@/images/vehicles/benz.jpg';
import Tig from '@/images/vehicles/blacktig.jpg';

const BusinessSolutionsPage = () => {
  return (
    <Container className="mt-16 sm:mt-32">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100 mb-4 text-center">
          Custom Business Solutions
        </h1>
        <p className="text-center text-lg text-zinc-600 dark:text-zinc-400">
          Tailored transportation to elevate your business operations.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Service 1: Corporate Travel */}
        <div className="flex flex-col items-center">
          <Image 
            src={Tig}
            alt="Corporate Travel"
            width={400} 
            height={250} 
            className="rounded-lg shadow-md"
            priority // Ensure this image loads as soon as possible
          />
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mt-4 text-center">
            Corporate Travel
          </h2>
          <p className="mt-2 text-center text-zinc-600 dark:text-zinc-400">
            Streamline your business travel with reliable, comfortable transportation for executives, clients, and employees.
          </p>
        </div>

        {/* Service 2: Event Transportation */}
        <div className="flex flex-col items-center">
          <Image 
            src={Benz}
            alt="Event Transportation"
            width={400} 
            height={250} 
            className="rounded-lg shadow-md"
            loading="lazy" // Lazily load this image as it is not the LCP element
          />
          <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200 mt-4 text-center">
            Event Transportation
          </h2>
          <p className="mt-2 text-center text-zinc-600 dark:text-zinc-400">
            Ensure your guests arrive in style and on time for conferences, meetings, or special occasions.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center">
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
          Let us create a custom solution for your unique needs.
        </p>
        <Link href="/contact">
          <button className="inline-block rounded-lg bg-[#00205A] px-6 py-3 font-medium text-white hover:bg-[#0050ba]">
            Get a Quote
          </button>
        </Link>
      </section>
    </Container>
  );
}

export default BusinessSolutionsPage;
