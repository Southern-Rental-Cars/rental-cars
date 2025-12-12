import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/Container'
import Benz from '@/images/vehicles/c_class2019.jpg'
import Logo from '@/images/transparent_southern_logo_5.png'
import BusinessSolutionsPage from './business-solutions/page'
import Testimonials from '@/components/Testimonials'

const HomePage = () => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full">
        <Image
          src={Benz}
          alt="Car on a scenic road"
          fill
          className="object-cover"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-t from-navy-800 via-navy-800/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy-800/90 via-navy-800/40 to-transparent"></div>

        <div className="absolute inset-0 z-20 flex items-center px-8 sm:px-16 lg:px-24">
          <div className="max-w-2xl text-left">
            <h1 className="mb-6 font-serif text-5xl font-bold leading-tight text-white md:text-7xl drop-shadow-lg">
              Rent with <br />
              <span className="text-gold-500">Confidence</span>
            </h1>
            <p className="mb-8 text-lg text-gray-200 md:text-xl font-light max-w-lg drop-shadow-md">
              Explore The Woodlands and Houston with our fleet of premium, handpicked vehicles designed for your comfort.
            </p>
            <div className="flex gap-4">
              <Link
                href="/vehicles"
                className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-navy-800 shadow-lg transition hover:bg-gold-500 hover:text-white"
              >
                Browse Fleet
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-white/40 bg-white/10 backdrop-blur-sm px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* About Us */}
      <Container className="py-24 bg-white">
        <div className="flex flex-col p-2 lg:flex-row lg:p-8 items-center">
          <div className="text-center lg:w-2/3 lg:text-left">
            <div className="space-y-12 text-zinc-600">
              {[
                {
                  title: 'Expect quality',
                  desc: 'We choose quality vehicles to ensure your drive is as wonderful as your journey.',
                },
                {
                  title: 'Tailored convenience',
                  desc: 'We ensure flexible services with delivery and pickup options.',
                },
                {
                  title: 'Hospitality you expect',
                  desc: 'With us, every trip handled with the best service in mind.',
                },
              ].map((item, index) => (
                <div key={index}>
                  <h3 className="mb-3 text-3xl font-serif font-bold tracking-wide text-navy-800">
                    {item.title}
                  </h3>
                  <p className="text-lg leading-relaxed text-zinc-600 max-w-xl mx-auto lg:mx-0">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-12 lg:mt-0 flex justify-center lg:ml-24 lg:w-1/3">
            <div className="relative h-64 w-48 lg:h-80 lg:w-64">
              <Image
                src={Logo}
                alt="Southern Rental Cars Logo"
                fill
                objectFit="contain"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </Container>

      {/* Business Solutions */}
      <Container className="bg-navy-800 py-16 text-white [&_h1]:text-white [&_h2]:text-white [&_p]:text-gray-300 [&_a]:text-white">
        <BusinessSolutionsPage />
      </Container>

      {/* Testimonials */}
      <Container className="bg-zinc-100 py-20">
        <Testimonials />
      </Container>
    </>
  )
}

export default HomePage