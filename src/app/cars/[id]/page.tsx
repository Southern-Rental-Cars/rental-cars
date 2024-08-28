// [id]/page.tsx (Server-side rendered page)
import { Container } from "@/components/Container";
import Image from "next/image";
import { fetchCarById } from "@/lib/db/queries";
import { Car } from '@/app/cars/types';
import { UserGroupIcon, KeyIcon } from '@heroicons/react/24/outline';

export default async function CarDetail({ params }: { params: { id: string } }) {
  // Fetch the car by id
  const carId = parseInt(params.id);
  const car: Car | null = await fetchCarById(carId);
  if (!car) {
    return (
      <Container>
        <h1>404 - Car not found</h1>
      </Container>
    );
  }

  return (
    <Container className="mt-12">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* Left Section - Image and basic details */}
        <div className="w-full h-64 lg:h-96 lg:w-2/3 relative">
          <Image
            src={car.image_url[0]}
            alt={`${car.make} ${car.model}`}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>

        {/* Right Section - Car details */}
        <div className="w-full lg:w-1/3">
          <h1 className="text-3xl font-bold">{`${car.make} ${car.model} ${car.year}`}</h1>
          <p className="text-lg text-gray-700 mt-2">{car.short_description}</p>

          {/* Price */}
          <p className="text-xl font-semibold mt-4">${car.price} / day</p>

          {/* Trip Details (Example: Seats, Doors) */}
          <ul className="mt-4 space-y-2 text-gray-600">
            <li className="flex items-center">
              <UserGroupIcon className="h-5 w-5 text-gray-500 mr-2" /> {/* Passenger icon */}
              {car.num_seats} seats
            </li>
            <li className="flex items-center">
              <KeyIcon className="h-5 w-5 text-gray-500 mr-2" /> {/* Doors icon */}
              {car.num_doors} doors
            </li>
          </ul>

          {/* CTA - Rent this car */}
          <a
            href={car.turo_url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 block bg-blue-500 text-white py-2 px-4 text-center rounded hover:bg-blue-600"
          >
            View on Turo
          </a>
        </div>
      </div>

      {/* Long description and extra details */}
      <div className="mt-10">
        <h2 className="text-2xl font-semibold">Description</h2>
        <p className="mt-2 text-gray-700">{car.long_description}</p>

        {/* Only render the Features section if there are features available */}
        {car.features && car.features.trim() && (
          <div>
            <h2 className="text-2xl font-semibold mt-6">Features</h2>
            <p className="mt-2 text-gray-700">{car.features}</p>
          </div>
        )}

        {/* Only render the Extras section if there are extras available */}
        {car.extras && car.extras.trim() && (
          <div>
            <h2 className="text-2xl font-semibold mt-6">Extras</h2>
            <p className="mt-2 text-gray-700">{car.extras}</p>
          </div>
        )}

        {/* Only render the Guidelines section if there are guidelines available */}
        {car.guidelines && car.guidelines.trim() && (
          <div>
            <h2 className="text-2xl font-semibold mt-6">Guidelines</h2>
            <p className="mt-2 text-gray-700">{car.guidelines}</p>
          </div>
        )}

        {/* Only render the FAQs section if there are FAQs available */}
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
    </Container>
  );
}
