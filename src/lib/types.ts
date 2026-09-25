export type UserRole = "renter" | "landlord";

export type Listing = {
  id: number;
  owner_id: string;
  title: string;
  description: string;
  city: string;
  district: string;
  address: string;
  lat: number;
  lng: number;
  rooms: number;
  area_m2: number;
  floor: number;
  floors_total: number;
  price_kzt: number;
  deposit_kzt: number;
  furnished: boolean;
  pets_allowed: boolean;
  kids_allowed: boolean;
  photos: string[];
  amenities: string[];
  status: string;
  available_from: string;
  created_at: string;
  owner_name?: string;
  owner_verified?: boolean;
  owner_trust?: number;
  review_avg?: number;
  review_count?: number;
};

export type Profile = {
  user_id: string;
  display_name: string;
  role: UserRole;
  phone: string;
  bio: string;
  city: string;
  verified: boolean;
  trust_score: number;
  language: string;
  created_at: string;
};

export type Application = {
  id: number;
  listing_id: number;
  renter_id: string;
  landlord_id: string;
  message: string;
  start_date: string;
  months: number;
  status: string;
  created_at: string;
  listing_title?: string;
  listing_city?: string;
  listing_photo?: string;
  listing_price?: number;
  counterparty_name?: string;
};

export type Conversation = {
  id: number;
  listing_id: number;
  renter_id: string;
  landlord_id: string;
  application_id: number | null;
  created_at: string;
  listing_title?: string;
  listing_photo?: string;
  other_name?: string;
  last_body?: string;
  last_at?: string;
};

export type ChatMessage = {
  id: number;
  conversation_id: number;
  sender_id: string;
  body: string;
  created_at: string;
};

export type Payment = {
  id: number;
  application_id: number;
  payer_id: string;
  payee_id: string;
  amount_kzt: number;
  kind: string;
  method: string;
  status: string;
  kaspi_ref: string;
  created_at: string;
  listing_title?: string;
};

export type Review = {
  id: number;
  listing_id: number;
  author_id: string;
  rating: number;
  body: string;
  created_at: string;
  author_name?: string;
};
