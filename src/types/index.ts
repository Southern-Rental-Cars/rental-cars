

/** This is a bit messy but this file is all exported interfaces for globally defined types */

export interface FAQ {
  question: string;
  answer: string;
}

export interface Vehicle {
  id: number;
  image_url: string;
  thumbnail: string;
  make: string;
  model: string;
  year: number;
  mpg: number;
  type: string;
  price: number;
  num_seats: number;
  num_doors: number;
  gas_type: string;
  short_description: string;
  features: string;
  extras: Extra[];
  guidelines: string;
  faqs: FAQ[];
}

export interface VehicleImages {
  id: number;
  vehicle_id: number;
  image_url: string;
}

export interface BookingExtras {
  id: number;
  extra_id: number;
  quantity: number;
  extras: {
    name: string;
    description: string;
    price_amount: number;
  };
}

export interface Booking {
  id: number;
  vehicle_id: number;
  vehicle: Vehicle;
  start_date: string;
  end_date: string;
  status: string;
  total_price: number;
  currency: string;
  booking_extras: BookingExtras[];
}

export interface User {
  id: number;
  email: string;
  admin?: boolean;
  full_name?: string;
  phone?: string;
  license_street_address?: string;
  license_zip_code?: string;
  license_number?: string;
  license_date_of_birth?: string;
  license_state?: string;
  license_city?: string;
  license_country?: string;
  license_expiration?: string;
  license_front_img?: string;
  license_back_img?: string;
  is_license_complete?: boolean;
  billing_street_address? : string;
  billing_city?: string;
  billing_state?: string;
  billing_zip_code?: string;
  is_billing_complete?: boolean;
}

export interface Extra {
  id: number;
  name: string;
  extra_name: string;
  price_type: 'DAILY' | 'TRIP';
  price_amount: number;
  description?: string;
  total_quantity?: number
  quantity?: number;
}

export interface GridProps {
  vehicles: Vehicle[];  // List of cars to display in the grid
}

export interface DetailsPageProps {
  vehicle: Vehicle;
  images: VehicleImages[];
  startDateTime: string;
  endDateTime: string;
  onProceedToPayment: () => void;
  onBack: () => void;
}

export interface ConfirmationProps {
  params: { id: string };
}

export interface PaypalButtonsProps {
  totalPrice: number;
  onPaymentSuccess: (paypalData: {
    paypal_order_id: string;
    paypal_transaction_id: string;
    is_paid: boolean;
  }) => void;
}

export interface PaypalOrder {
  paypal_order_id: string;
  paypal_transaction_id: string;
  is_paid: boolean;
}