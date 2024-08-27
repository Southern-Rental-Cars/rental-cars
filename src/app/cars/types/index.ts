export interface Car {
    id: number;  // Add a unique car identifier
    car_name: string;
    short_description: string;
    image_url: string;
    turo_url: string;
    make: string;
    model: string;
    year: BigInteger;
    type: string;
    price: number;
    num_seats: number;
    num_doors: number;
    long_description: string;
    features: string;
    extras: string;
    guidelines: string;
    faqs: string;
  }

export interface CarViewProps {
    cars: Car[];
}

export interface CarGridProps {
    cars: Car[];
    types: string[];
    priceRange: [number, number];
    sort: string;
}

export interface CarFilterProps {
    onFilterChange: (minPrice: number, maxPrice: number, types: string[], sortBy: string) => void;
    initialPriceRange: [number, number];
    cars: CarType[];
    sort: string;
    types: string[];
}


export interface CarType {
    type: string;
}

export interface CarTypeProps {
    cars: CarType[];
    selectedTypes: string[];
    onCarClassChange: (selectedTypes: string[]) => void;
}

export interface ModalProps {
    isFilterOpen: boolean;
    toggleFilter: () => void;
    handleFilterChange: (minPrice: number, maxPrice: number, selectedTypes: string[], sortBy: string) => void;
    priceRange: [number, number];
    cars: any[];
    sort: string;
    types: string[];
}

export interface CarPriceRangeProps {
    minPrice: number;
    maxPrice: number;
    onPriceChange: (minPrice: number, maxPrice: number) => void;
}

export interface ToggleProps {
    isFilterOpen: boolean;
    toggleFilter: () => void;
}

export interface CarSortProps {
    onSortChange: (sortOption: string) => void;
    selectedSort: string;  // Add this to allow parent component to control the sort option
  }