export interface Car {
  id: number;
  brand: string;
  model: string;
  price_per_day: number;
  year: number;
  fuel_type: string;
  transmission: string;
  image_url: string;
  seats: number;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}