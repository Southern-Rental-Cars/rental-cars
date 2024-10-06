// Represents a FAQ item with a question and an answer.
export interface FAQ {
    question: string;
    answer: string;
  }
  
  // Represents the structure of a car object with detailed attributes.
  export interface Car {
    id: number;  // Unique identifier for the car
    car_name: string;
    short_description: string;
    image_url: string;
    turo_url: string;
    make: string;
    model: string;
    year: number;  // Using `number` instead of `BigInteger` to keep it simple for years
    mpg: number;
    type: string;
    price: number;  // Price of the car
    num_seats: number;
    num_doors: number;
    long_description: string;
    gas_type: string;
    features: string;
    extras: string;
    guidelines: string;
    faqs: FAQ[];  // Array of FAQ objects for the car
  }
  
  // Props for the component that displays a grid of cars.
  export interface CarViewProps {
    cars: Car[];  // Array of car objects
  }
  
  // Props for the car grid, with additional filtering and sorting options.
  export interface CarGridProps {
    cars: Car[];  // List of cars to display in the grid
    types: string[];  // Array of car types (e.g., SUV, sedan)
    priceRange: [number, number];  // Price range for filtering cars
    sort: string;  // Sort option (e.g., price, year)
  }
  
  // Props for the car filter component to handle filter logic (price, type, sorting).
  export interface CarFilterProps {
    onFilterChange: (minPrice: number, maxPrice: number, types: string[], sortBy: string) => void;  // Callback to handle filter changes
    initialPriceRange: [number, number];  // Initial price range for the filter
    cars: CarType[];  // Array of car types to filter by
    sort: string;  // Sorting option
    types: string[];  // Currently selected types
  }
  
  // Represents a car type (e.g., SUV, sedan).
  export interface CarType {
    type: string;  // Name of the car type
  }
  
  // Props for car type filtering logic (selection of car classes/types).
  export interface CarTypeProps {
    cars: CarType[];  // Available car types to choose from
    selectedTypes: string[];  // Array of selected car types (e.g., SUV, sedan)
    onCarClassChange: (selectedTypes: string[]) => void;  // Callback for when car types are changed
  }
  
  // Props for the modal component used in mobile view for filtering.
  export interface ModalProps {
    isFilterOpen: boolean;  // Indicates if the filter modal is open or closed
    toggleFilter: () => void;  // Function to toggle the filter modal
    handleFilterChange: (minPrice: number, maxPrice: number, selectedTypes: string[], sortBy: string) => void;  // Callback to handle filter changes inside the modal
    priceRange: [number, number];  // Price range selected in the filter
    cars: Car[];  // Array of cars for filtering
    sort: string;  // Sort option (e.g., price, year)
    types: string[];  // Array of selected car types
  }
  
  // Props for the price range filter component.
  export interface CarPriceRangeProps {
    minPrice: number;  // Minimum price in the range
    maxPrice: number;  // Maximum price in the range
    onPriceChange: (minPrice: number, maxPrice: number) => void;  // Callback when the price range changes
  }
  
  // Props for the toggle button used to open or close the filter in mobile view.
  export interface ToggleProps {
    isFilterOpen: boolean;  // Boolean to indicate if the filter is open or closed
    toggleFilter: () => void;  // Function to toggle the filter's visibility
  }
  
  // Props for the sort component, allowing selection of sorting options.
  export interface CarSortProps {
    onSortChange: (sortOption: string) => void;  // Callback when the sort option is changed
    selectedSort: string;  // Currently selected sort option
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
  