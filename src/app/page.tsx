import Image from 'next/image'
// import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Container } from '@/components/Container'
// import Link from 'next/link'
import Benz from '@/images/vehicles/benz_c_class.png'
import ContactPage from './contact/page'
import Logo from '@/images/transparent_southern_logo_5.png'
import BusinessSolutionsPage from './business-solutions/page'
import Testimonials from '@/components/Testimonials'

const HomePage = () => {
  return (
    <>
      {/* Hero */}
      <div className="relative h-[67vh] w-full">
        <Image
          src={Benz}
          alt="Car on a scenic road"
          layout="fill"
          loading="eager" // Eager loading for hero images
          objectFit="cover"
          priority // Prioritize for faster loading
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Responsive image sizes
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#14223f] to-transparent brightness-50"></div>

        <div className="absolute inset-0 z-20 flex items-center justify-center px-8">
          <div className="text-left">
            <h1 className="mb-4 text-5xl font-extrabold tracking-widest text-white md:text-6xl">
              Rent with Confidence
            </h1>
            <p className="tracking-right mb-4 text-lg text-gray-300 md:text-xl">
              Explore The Woodlands and Houston with our handpicked cars
            </p>
            {/* <Link href="/vehicles" className="bg-[#2f4269] text-white py-3 px-6 rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out inline-flex items-center" passHref>
                Search reservations  <ChevronRightIcon className="h-5 w-5 ml-2" />
            </Link> */}
          </div>
        </div>
      </div>

      {/* About Us */}
      <Container className="py-20">
        <div className="flex flex-col p-2 lg:flex-row lg:p-8">
          <div className="text-center lg:w-2/3">
            <h2 className="mb-8 text-5xl font-bold tracking-wide md:text-5xl dark:text-[#d9ab69]">
              At Southern Rental Cars
            </h2>
            <div className="space-y-8 text-zinc-600 dark:text-zinc-400">
              {[
                {
                  title: 'Expect quality',
                  desc: 'We choose quality vehicles to ensure your drive is as wonderful as your journey.',
                },
                {
                  title: 'Tailored convenience',
                  desc: 'We ensure flexibile services with delivery and pickup options.',
                },
                {
                  title: 'Hospitality you expect',
                  desc: 'With us, every trip handled with the best service in mind.',
                },
              ].map((item, index) => (
                <div className="text-left" key={index}>
                  <h3 className="md:textxl mb-2 text-3xl font-bold tracking-wide text-black">
                    {item.title}
                  </h3>
                  <p className="text-md tracking-wide text-zinc-600 md:text-xl">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex justify-center lg:ml-24 lg:mt-0 lg:mt-16">
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
      <Container className="bg-[#14223f] p-1 pb-12 text-white">
        <BusinessSolutionsPage />
      </Container>

      {/* Contact */}
      <Container className="pb-12">
        <ContactPage />
      </Container>

      {/* Testimonials */}
      <Container className="bg-gray-200 py-12">
        <Testimonials />
      </Container>
    </>
  )
}

export default HomePage
