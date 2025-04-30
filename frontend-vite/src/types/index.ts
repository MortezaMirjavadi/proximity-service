export interface Business {
  business_id: number;
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  distance?: number;
  image?: string;
}

export interface SearchLocation {
  latitude: number | null;
  longitude: number | null;
}

export interface NewBusiness {
  name: string;
  type: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
}

export interface City {
  id: number;
  name: string;
  state?: string;
  country_id: number;
  country_name?: string;
}

export interface Country {
  id: number;
  name: string;
  code?: string;
}

export interface Filter {
  city?: string;
  country?: string;
}