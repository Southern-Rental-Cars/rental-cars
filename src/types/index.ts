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

export interface User {
  id: number;
  email: string;
  admin?: boolean;
  full_name?: string;
  phone?: string;
  license_street_address?: string;
  license_zip_code?: string;
  license_number?: string;
  license_date_of_birth?: Date;
  license_state?: string;
  license_city?: string;
  license_country?: string;
  license_expiration?: Date;
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

export interface PaypalButtonsProps {
  totalPrice: number;
  onPaymentSuccess: (paypalData: {
    paypal_order_id: string;
    paypal_transaction_id: string;
    is_paid: boolean;
  }) => void;
}

export interface PaymentRadioOptionProps {
  label: string;
  value: string;
  selectedValue: string;
  onChange: (value: string) => void;
}

export interface ConfirmBookingBtnProps {
  isPaying: boolean;
  onSubmit: () => Promise<void>;
}

// config.ts
export const PAYPAL_CONFIG = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
  components: "buttons,card-fields",
  "disable-funding": "",
  currency: "USD",
  "buyer-country": "US",
  "data-page-type": "product-details",
  "data-sdk-integration-source": "developer-studio",
};

export const CARD_FIELD_STYLE = {
  input: {
    "font-size": "16px",
    color: "#333",
    padding: "8px",
    "border-radius": "8px",
  },
  ".invalid": {
    color: "red",
  },
  ".paypal-number-field": {
    "font-size": "18px",
    color: "#111",
  },
};

export interface PaypalData {
  paypal_order_id: string;
  paypal_transaction_id: string;
  is_paid: boolean;
}

export interface PaymentPageProps {
  vehicle: Vehicle;
  startDate: string;
  endDate: string;
  extras: Extra[];
  availability: any;
  onBackToDetails: () => void;
}

export interface DetailsProps {
  vehicle: Vehicle;
  images: VehicleImages[];
  startDateTime: string;
  endDateTime: string;
  onBack: () => void;
  onProceedToPayment: () => void;
}