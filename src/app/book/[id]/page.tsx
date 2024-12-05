import { fetchBookingById, fetchUserById, fetchVehicleById } from '@/utils/db/db';
import React from 'react';
import { format } from 'date-fns';
import Image from 'next/image';
import southernLogo from '@/images/transparent_southern_logo_3.png';
import { Extra, ConfirmationProps } from '@/types/index';
import { cookies } from 'next/headers';

// Reusable Card component with enhanced styling
const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
 <div className="bg-white border border-gray-200 rounded-xl p-6 transition duration-200 hover:shadow-md">
   <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
   <div className="mb-4"></div>
   {children}
 </div>
);

const Confirmation = async ({ params }: ConfirmationProps) => {
 const token = cookies().get('token')?.value;
 const booking = await fetchBookingById(params.id, token);
 const user = await fetchUserById(token);
 const vehicle = await fetchVehicleById(booking?.vehicle_id);

 if (!booking || !user || !vehicle) {
   return (
     <div className="min-h-screen flex items-center justify-center">
       <div className="text-center text-gray-600 space-y-4">
         <h1 className="text-2xl font-semibold">Resource Not Found</h1>
         <p>Unable to find requested booking information. Call us.</p>
       </div>
     </div>
   );
 }

 const vehicleName = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
 const formattedStartDate = format(new Date(booking.start_date), 'EEE, MMM do - h:mm a');
 const formattedEndDate = format(new Date(booking.end_date), 'EEE, MMM do - h:mm a');
 const deliveryInfo = booking.delivery_required ? {
   type: booking.delivery_type === 'local' ? 'Local Delivery' : 'IAH Airport Delivery',
   address: booking.delivery_type === 'local' ? booking.delivery_address : 
           'George Bush Intercontinental Airport, 2800 N Terminal Rd, Houston, TX 77032'
 } : null;

 return (
   <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
     <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
    {/* Success Header */}
    <div className="mb-8">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Booking Confirmed!</h1>
        <p className="text-lg md:text-xl text-gray-600 mt-2">Thank you for booking with us</p>
      </div>
      <Image 
        src={southernLogo} 
        alt="Southern Car Rentals Logo" 
        width={100}
        height={30}
        className="mb-6 w-24 md:w-36"
      />
    </div>
    </div>
       {/* Vehicle Details */}
       <Card title="Vehicle Information">
        <div className="space-y-6">
          <div className="relative h-48 md:h-64 rounded-lg overflow-hidden">
            <Image
              src={vehicle.thumbnail}
              alt={vehicleName}
              layout="fill"
              objectFit="cover"
              className="transform hover:scale-105 transition duration-500"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold text-gray-900">{vehicleName}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Doors</p>
                <p className="font-semibold">{vehicle.num_doors}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Seats</p>
                <p className="font-semibold">{vehicle.num_seats}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Fuel</p>
                <p className="font-semibold">{vehicle.gas_type}</p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">MPG</p>
                <p className="font-semibold">{vehicle.mpg}</p>
              </div>
            </div>
          </div>
        </div>
       </Card>

       {/* Rental Period */}
       <Card title="Rental Period">
         <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <p className="text-sm text-gray-500">Pick-up</p>
             <p className="font-medium text-gray-900">{formattedStartDate}</p>
           </div>
           <div className="space-y-2">
             <p className="text-sm text-gray-500">Drop-off</p>
             <p className="font-medium text-gray-900">{formattedEndDate}</p>
           </div>
         </div>
       </Card>

       {/* Customer Details */}
       <Card title="Customer Information">
         <div className="space-y-4">
           <div className="flex items-center space-x-4">
             <div className="flex-1">
               <p className="text-sm text-gray-500">Email</p>
               <p className="font-medium text-gray-900">{user.email}</p>
             </div>
           </div>
         </div>
       </Card>

       {/* Delivery Details if applicable */}
       {deliveryInfo && (
         <Card title="Delivery Information">
           <div className="space-y-4">
             <div>
               <p className="text-sm text-gray-500">Service Type</p>
               <p className="font-medium text-gray-900">{deliveryInfo.type}</p>
             </div>
             <div>
               <p className="text-sm text-gray-500">Delivery Location</p>
               <p className="font-medium text-gray-900">{deliveryInfo.address}</p>
             </div>
           </div>
         </Card>
       )}

       {/* Extras */}
       <Card title="Additional Services">
         {booking.bookingExtras.length > 0 ? (
           <div className="space-y-4">
             {booking.bookingExtras.map((extra: Extra) => (
               <div key={extra.id} className="flex justify-between items-center py-2">
                 <span className="text-gray-900">{extra.extra_name}</span>
                 <span className="font-medium text-gray-700">Qty: {extra.quantity}</span>
               </div>
             ))}
           </div>
         ) : (
           <p className="text-gray-500">No additional services selected</p>
         )}
       </Card>

       {/* Payment Summary */}
       <Card title="Payment Details">
         <div className="space-y-4">
           {booking.paypal_transaction_id && (
             <div className="bg-gray-50 p-4 rounded-lg">
               <p className="text-sm text-gray-500">Transaction ID</p>
               <p className="font-mono text-gray-900">{booking.paypal_transaction_id}</p>
             </div>
           )}
           <div className="flex justify-between items-center pt-4 border-t border-gray-100">
             <span className="text-lg font-medium text-gray-900">Total Paid</span>
             <span className="text-2xl font-bold text-gray-900">
               ${parseFloat(booking.total_price).toFixed(2)}
             </span>
           </div>
         </div>
       </Card>
     </div>
   </div>
 );
};

export default Confirmation;