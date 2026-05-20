export interface Car {
  id: number;
  brand_id: number;
  model_id: number;
  status: string;
  car_type_id: number;
  fuel_type_id: number;
  gearbox_type_id: number;
  plate: string;
  seats: number;
  doors: number;
  color: string;
  fuel_per_km: number;
  mileage: number;
  year: number;
  price_per_day: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}