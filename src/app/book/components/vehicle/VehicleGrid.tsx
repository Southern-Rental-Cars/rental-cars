import { Card } from '@/app/book/components/vehicle/Card';
import Image from 'next/image';
import React from 'react';
import { VehicleGridProps, Vehicle } from '@/types';

interface SelectedVehicleProps extends VehicleGridProps {
  onSelectVehicle: (vehicle: Vehicle) => void; // Add a prop to handle vehicle selection
}

const VehicleGrid: React.FC<SelectedVehicleProps> = ({ vehicles, onSelectVehicle }) => {
  return (
    <>
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-6">
        {vehicles.map((vehicle) => (
          <div key={vehicle.id} onClick={() => onSelectVehicle(vehicle)}>
            <Card className="rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between h-full cursor-pointer">
              <div className="relative h-48 w-full">
                <Image
                  src={vehicle.image_url}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="rounded-t-xl"
                  priority
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <h2 className="mb-1 text-lg font-semibold">
                  {`${vehicle.year} ${vehicle.make}`}
                </h2>
                <p className="mb-3 text-md text-gray-700 font-semibold flex-grow">
                  {vehicle.type} | {vehicle.num_doors} doors | {vehicle.num_seats} seats
                </p>
                <p className="text-lg text-black font-semibold flex-grow">
                  ${vehicle.price} / Daily
                </p>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
};

export default VehicleGrid;
