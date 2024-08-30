// [id]/page.tsx (Server-side rendered page)
import { Container } from "@/components/Container";
import Image from "next/image";
import { fetchCarById } from "@/lib/db/queries";
import { Car } from '@/app/cars/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faGasPump, faDoorOpen } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/Button";

export default async function CarDetail({ params }: { params: { id: string } }) {
  // Fetch the car by id
  const carId = parseInt(params.id);
  const car: Car | null = await fetchCarById(carId);
  if (!car) {
    return (
      <Container>
        <h1>HTTP 404 - Car not found</h1>
      </Container>
    );
  }

  // Ensure image_url is an array
  const images = typeof car.image_url === 'string' ? JSON.parse(car.image_url) : car.image_url;

  return (
    <Container className="mt-12">
        <h1 className="text-3xl font-semibold mb-5">{`${car.make} ${car.model} ${car.year}`}</h1>

        {/* image grid */}
        <div className="block">
          <div className="relative h-96">
            <div className="overflow-x-auto flex snap-x snap-mandatory h-full w-full">
              {images.map((url: string, index: number) => (
                <div key={index} className="snap-center shrink-0 w-full h-full relative">
                  <Image
                    src={url}
                    alt={`${car.make} ${car.model} - Image ${index + 1}`}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded">
                    <span id="current-index">{index+1}</span> / {images.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* md,lg details section  */}
        <div className="hidden md:flex lg:flex">
          {/* left section */}
          <div className="md:w-2/3 lg:w-2/3 mt-10">
                <h2 className="text-3xl font-semibold">Description</h2>
                <p className="mt-2 text-gray-700">{car.long_description}</p>
                {car.features && car.features.trim() && (
                  <div>
                    <h2 className="text-3xl font-semibold mt-6">Features</h2>
                    <p className="mt-2 text-gray-700">{car.features}</p>
                  </div>
                )}

                {car.extras && car.extras.trim() && (
                  <div>
                    <h2 className="text-3xl font-semibold mt-6">Extras</h2>
                    <p className="mt-2 text-gray-700">{car.extras}</p>
                  </div>
                )}

                {car.guidelines && car.guidelines.trim() && (
                  <div>
                    <h2 className="text-2xl font-semibold mt-6">Guidelines</h2>
                    <p className="mt-2 text-gray-700">{car.guidelines}</p>
                  </div>
                )}

                {car.faqs && car.faqs.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mt-6">FAQs</h2>
                    <div className="mt-2 space-y-4">
                      {car.faqs.map((faq, index) => (
                        <div key={index}>
                          <p className="font-semibold text-gray-800">{faq.question}</p>
                          <p className="text-gray-600">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
          </div>
          {/* right section */}
          <div className="md:w-1/3 lg:w-1/3 mt-10 ml-10 shadow-xl p-5 rounded-xl h-fit border">
            <div className="flex items-center">
              <p className="text-2xl font-semibold"> ${car.price} </p> 
              <p className="text-black text-md ml-1"> / day </p>
            </div>
            <p className="text-lg text-gray-700 py-2">{car.short_description}</p>
            <ul className="grid grid-cols-2 gap-4 text-gray-600">
              <li className="flex items-center">
                <FontAwesomeIcon icon={faDoorOpen} className="h-5 w-5 text-gray-500 mr-2" />
                {car.num_doors} doors
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-500 mr-2" />
                {car.num_seats} seats
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faGasPump} className="h-5 w-5 text-gray-500 mr-2" />
                {car.mpg} MPG
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faGasPump} className="h-5 w-5 text-gray-500 mr-2" />
                {car.gas_type}
              </li>
            </ul>
            <a href={car.turo_url} target="_blank" rel="noopener noreferrer" className="mt-6 block bg-blue-500 text-white py-2 px-4 text-center rounded hover:bg-blue-600"> Book on Turo </a>
          </div>          
        </div>

        {/* sm details section */}
        <div className="md:hidden lg:hidden">
          {/* top section */}
          <div className="mt-10 shadow-xl p-5 rounded-xl h-fit border">
            <div className="flex items-center">
              <p className="text-2xl font-semibold">${car.price} </p> 
              <p className="text-black text-md ml-1">/ day</p>
            </div>
            <p className="text-lg text-gray-700 py-2">{car.short_description}</p>
            <ul className="grid grid-cols-2 gap-4 text-gray-600">
              <li className="flex items-center">
                <FontAwesomeIcon icon={faDoorOpen} className="h-5 w-5 text-gray-500 mr-2" />
                {car.num_doors} doors
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-500 mr-2" />
                {car.num_seats} seats
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faGasPump} className="h-5 w-5 text-gray-500 mr-2" />
                {car.mpg} MPG
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon icon={faGasPump} className="h-5 w-5 text-gray-500 mr-2" />
                {car.gas_type}
              </li>
            </ul>
            <a href={car.turo_url} target="_blank" rel="noopener noreferrer" className="mt-6 block bg-blue-500 text-white py-2 px-4 text-center rounded hover:bg-blue-600"> Book on Turo </a>
          </div>
          {/* bottom section */}
          <div className="mt-10">
            <h2 className="text-3xl font-semibold">Description</h2>
            <p className="mt-2 text-gray-700">{car.long_description}</p>

            {car.features && car.features.trim() && (
              <div>
                <h2 className="text-3xl font-semibold mt-6">Features</h2>
                <p className="mt-2 text-gray-700">{car.features}</p>
              </div>
            )}

            {car.extras && car.extras.trim() && (
              <div>
                <h2 className="text-3xl font-semibold mt-6">Extras</h2>
                <p className="mt-2 text-gray-700">{car.extras}</p>
              </div>
            )}

            {car.guidelines && car.guidelines.trim() && (
              <div>
                <h2 className="text-2xl font-semibold mt-6">Guidelines</h2>
                <p className="mt-2 text-gray-700">{car.guidelines}</p>
              </div>
            )}
            {car.faqs && car.faqs.length > 0 && (
              <div>
                <h2 className="text-2xl font-semibold mt-6">FAQs</h2>
                <div className="mt-2 space-y-4">
                  {car.faqs.map((faq, index) => (
                    <div key={index}>
                      <p className="font-semibold text-gray-800">{faq.question}</p>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>          
        </div>

    </Container>
  );
}
