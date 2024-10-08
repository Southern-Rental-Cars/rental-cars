export interface FAQ {
    question: string;
    answer: string;
  }
  
  export interface CarImage {
    id: number;
    car_id: number;
    image_url: string;
  }
  
  export interface Vehicle {
    id: number;
    car_name: string;
    short_description: string;
    image_url: string;
    turo_url: string;
    make: string;
    model: string;
    year: number;
    mpg: number;
    type: string;
    price: number;
    num_seats: number;
    num_doors: number;
    long_description: string;
    gas_type: string;
    features: string;
    extras: string;
    guidelines: string;
    faqs: FAQ[];
    carImages: CarImage[]; // Include the array of images here
  }
  
  export interface VehicleGridProps {
    vehicles: Vehicle[];  // List of cars to display in the grid
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
    car_id: number;
    start_date: string;
    end_date: string;
    status: string;
    total_cost: number;
    car_name?: string;
    booking_extras: BookingExtras[];
  }
  
  export interface User {
    id: number;
    full_name: string;
    email: string;
    date_of_birth?: string;
    role_access?: string;
    phone?: string;
    street_address?: string;
    zip_code?: string;
    country?: string | null;
    license_number?: string;
    license_state?: string;
    license_expiration?: string;
  }
  