// [id]/page.tsx (Server-side rendered page)
import { Container } from "@/components/Container";
import Image from "next/image";
import { fetchCarById } from "@/lib/db/queries";
import { Car } from '@/types';
import dynamic from 'next/dynamic';

// Dynamically import the BookingCard component to render on the client side only
const BookingCard = dynamic(() => import('../components/Booking/page'), { ssr: false });

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
        <div className="relative h-72 md:h-96">
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

      {/* md,lg details section */}
      <div className="hidden md:flex">
        {/* left section */}
        <div className="md:w-2/3 mt-10">
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

        {/* right section (Booking Card) */}
        <div className="md:w-1/3 mt-10 ml-10 shadow-xl p-5 rounded-xl h-fit border">
          {/* Pass car details to BookingCard */}
          <BookingCard
            carId={carId}
            carName={car.make + ' ' + car.model}
            carPrice={car.price}
            carDetails={{
              shortDescription: car.short_description,
              numDoors: car.num_doors,
              numSeats: car.num_seats,
              mpg: car.mpg,
              gasType: car.gas_type,
            }}
          />
        </div>
      </div>

      {/* sm details section */}
      <div className="md:hidden">
        {/* Pass car details to BookingCard */}
        <BookingCard
          carId={carId}
          carName={car.make + ' ' + car.model}
          carPrice={car.price}
          carDetails={{
            shortDescription: car.short_description,
            numDoors: car.num_doors,
            numSeats: car.num_seats,
            mpg: car.mpg,
            gasType: car.gas_type,
          }}
        />

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
