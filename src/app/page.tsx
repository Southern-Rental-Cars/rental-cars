import Image from 'next/image';
import { ChevronRightIcon } from '@heroicons/react/20/solid';
import { Container } from '@/components/Container';
import Link from 'next/link';
import Benz from '@/images/vehicles/benz_c_class.png';
import ContactPage from './contact/page';
import Logo from '@/images/transparent_southern_logo_5.png';
import BusinessSolutionsPage from './business-solutions/page';

const HomePage = () => {
  return (
    <>
      {/* Hero */}
      <div className="relative w-full h-[67vh]">
        <Image
          src={Benz}
          alt="Car on a scenic road"
          layout="fill"
          loading="lazy" // Lazily load this image as it is not the LCP element
          objectFit="cover" // Ensures the image covers the container while maintaining aspect ratio
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#14223f] to-transparent brightness-50"></div>
        
        <div className="absolute inset-0 z-20 flex justify-center items-center px-8">
          <div className="text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-widest text-white mb-4">
              Rent with Confidence 
            </h1>
            <p className="text-lg tracking-right md:text-xl text-gray-300 mb-4">
              Explore The Woodlands and Houston with our handpicked cars
            </p>
            <Link href="/vehicles" className="bg-[#2f4269] text-white py-3 px-6 rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out inline-flex items-center" passHref>
                Search reservations  <ChevronRightIcon className="h-5 w-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* About Us */}
      <Container className="py-20">
        <div className='flex flex-col lg:flex-row p-2 lg:p-8'>
          <div className="text-center lg:w-2/3">
            <h2 className="text-5xl md:text-5xl font-bold tracking-wide dark:text-[#d9ab69] mb-8">
              At Southern Rental Cars
            </h2>
            <div className="text-zinc-600 dark:text-zinc-400 space-y-8">
              {[
                { title: "Expect quality", desc: "We choose quality vehicles to ensure your drive is as wonderful as your journey." },
                { title: "Tailored convenience", desc: "We ensure flexibile services with delivery and pickup options." },
                { title: "Hospitality you expect", desc: "With us, every trip handled with the best service in mind." }
              ].map((item, index) => (
                <div className="text-left" key={index}>
                  <h3 className="text-3xl font-bold md:textxl text-black tracking-wide mb-2">{item.title}</h3>
                  <p className="text-zinc-600 text-md md:text-xl tracking-wide">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 lg:mt-0 lg:ml-24 lg:mt-16 flex justify-center">
            <div className="relative h-52 w-36 lg:h-72 lg:w-56">
              <Image
                src={Logo}
                alt="Southern Rental Cars Logo"
                layout="fill"
                priority
                objectFit="contain"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </Container>
      
            {/* Business Solutions */}
      <Container className="bg-[#14223f] text-white">
        <BusinessSolutionsPage />
      </Container>  

      {/* Contact */}
      <Container className="bg-gray-300">
        <ContactPage />
      </Container>





    </>
  );
};

export default HomePage;