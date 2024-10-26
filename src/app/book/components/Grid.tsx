import { Card } from '@/app/book/components/Card';
import Image from 'next/image';
import React from 'react';
import { GridProps, Vehicle } from '@/types';

interface SelectVehicleProps extends GridProps {
  onSelectVehicle: (vehicle: Vehicle) => void; // Prop to handle vehicle selection
}

const Grid: React.FC<SelectVehicleProps> = ({ vehicles, onSelectVehicle }) => {
  return (
    <div className="w-full px-4 sm:px-6 lg:px-8"> {/* Added padding on mobile and larger screens */}
      {vehicles.length === 0 ? (
        // Display a professional message if no vehicles are available
        <div className="flex flex-col items-center justify-center h-full mt-20">
          <h2 className="text-2xl font-semibold text-gray-800 text-center">No vehicles available</h2>
          <p className="text-md text-gray-600 mt-2 text-center">
            Due to high demand, we don't have vehicles for the selected dates.
          </p>
        </div>
      ) : (
        // Render the grid of vehicles when available
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="cursor-pointer" onClick={() => onSelectVehicle(vehicle)}>
              <Card className="rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full">
                <div className="relative w-full h-48">
                  <Image
                    src={vehicle.image_url}
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
                  <Card.Description> {`${vehicle.type} • ${vehicle.num_doors} doors • ${vehicle.num_seats} seats`} </Card.Description>
                  {/* Price */}
                  <p className="mt-1 text-md font-semibold text-black"> ${vehicle.price} / daily </p>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Grid;
