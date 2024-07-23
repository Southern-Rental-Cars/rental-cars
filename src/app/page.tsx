import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Container } from '@/components/Container';
import Link from 'next/link';
import Taos from '@/images/vehicles/taos.jpg';
import BannerImage from '@/images/banner.png';

const HomePage = () => {
  return (
    <Container>
      {/* Banner */}
      <section className="py-4">
        <Image
          src={BannerImage}
          alt="Hero Banner"
          layout="responsive"
          width={1920}
          height={1080}
          priority
          className="rounded-xl shadow-md mt-12 mb-4"
        />
      </section>

      {/* Hero Section */}
      <section className="my-12 flex flex-col items-center md:flex-row p-4">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-800 dark:text-zinc-100 mb-4">
            Rent Your Ride with Confidence
          </h1>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-8">
            Explore The Woodlands and Houston with our handpicked vehicles.
          </p>
          <Link href="/vehicles" className="bg-sky-500 text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-sky-600 transition duration-300 ease-in-out inline-flex items-center">
            Start Your Adventure <ChevronRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="md:w-1/2 m-8 md:mt-0">
          <Image
            src={Taos}
            alt="Car on a scenic road"
            width={800}
            height={600}
            layout="responsive"
            priority
            className="rounded-xl shadow-md"
          />
        </div>
      </section>

      {/* About Section */}
      <section className="my-12 text-center">
        <h2 className="text-3xl font-semibold text-zinc-800 dark:text-zinc-200 mb-4">
          Why Choose Southern Rental Cars?
        </h2>
        <p className="text-lg text-zinc-600 dark:text-zinc-400">
          At Southern Rental Cars, we believe that renting a car should be more than just a transaction – it should be an extension of your journey.
          We offer a handpicked selection of quality vehicles, convenient delivery and pickup options throughout the Houston area, and personalized service that goes above and beyond.
        </p>
      </section>

      {/* Featured Vehicles Section */}

    </Container >
  );
}

export default HomePage;