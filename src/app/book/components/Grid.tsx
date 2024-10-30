import { Card } from '@/app/book/components/Card';
import Image from 'next/image';
import React from 'react';
import { GridProps } from '@/types';
import { Vehicle } from '@/types';

interface SelectVehicleProps extends GridProps {
  onSelectVehicle: (vehicle: Vehicle) => void; // Prop to handle vehicle selection
}

const Grid: React.FC<SelectVehicleProps> = ({ vehicles, onSelectVehicle }) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="cursor-pointer" onClick={() => onSelectVehicle(vehicle)}>
              <Card className="bg-white rounded-lg hover:bg-gray-100 border border-gray-200 transition-shadow duration-300 flex flex-col justify-between h-full">
                <div className="relative w-full h-48">
                  <Image
                    src={vehicle.thumbnail}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="rounded-t-lg"
                    priority
                  />
                </div>
                <div className="flex flex-col p-4">
                  {/* Call to Action */}
                  <Card.Cta>AVAILABLE</Card.Cta>
                  {/* Title (Year + Make) */}
                  <Card.Title as="h2"> {`${vehicle.year} ${vehicle.make}`} </Card.Title>
                  {/* Description (Vehicle Type, Doors, Seats) */}
                  <Card.Description> {`${vehicle.type} • ${vehicle.num_doors} doors • ${vehicle.num_seats} seats • ${vehicle.mpg} MPG`} </Card.Description>
                  {/* Price */}
                  <p className="mt-1 text-md font-semibold text-black"> ${vehicle.price} / DAILY </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
    </div>
  );
};

export default Grid;
