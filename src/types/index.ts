export interface FAQ {
  question: string;
  answer: string;
}

export interface Vehicle {
  id: number;
  short_description: string;
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
  features: string;
  extras: Extra[];
  guidelines: string;
  faqs: FAQ[];
}

export interface VehicleImages {
  id: number;
  image_url: string;
  vehicle_id: number;
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
  start_date: string;
  end_date: string;
  status: string;
  total_price: number;
  booking_extras: BookingExtras[];
  currency: string;
}

// Define a role access type with only "customer" and "admin" as possible values
export type RoleAccess = 'customer' | 'admin';

export interface User {
  id: number;
  full_name: string;
  email: string;
  date_of_birth?: Date;
  role_access?: RoleAccess;  // Updated to use RoleAccess type
  phone?: string;
  street_address?: string;
  zip_code?: string;
  license_number?: string;
  license_state?: string;
  license_city?: string;
  license_country?: string;
  license_expiration?: Date;
  license_front_img?: string;
  license_back_img?: string;
}

export interface Extra {
  id: number;
  name: string;
  price_amount: number;
  price_type: 'DAILY' | 'TRIP';
  description?: string;
  quantity?: number;
  total_quantity?: number
}

export interface GridProps {
  vehicles: Vehicle[];  // List of cars to display in the grid
}

export interface ConfirmationProps {
  params: { id: string };
}