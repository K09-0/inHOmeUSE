import { isoDate, isoStamp, parseJsonArray } from "@/lib/utils";
import type { Application, ChatMessage, Conversation, Listing, Payment, Profile, Review } from "@/lib/types";

type Row = Record<string, unknown>;

function num(v: unknown): number {
  return typeof v === "number" ? v : Number(v ?? 0);
}

function bool(v: unknown): boolean {
  return v === true || v === "t" || v === "true";
}

export function mapListing(row: Row): Listing {
  return {
    id: num(row.id),
    owner_id: String(row.owner_id),
    title: String(row.title),
    description: String(row.description),
    city: String(row.city),
    district: String(row.district),
    address: String(row.address),
    lat: num(row.lat),
    lng: num(row.lng),
    rooms: num(row.rooms),
    area_m2: num(row.area_m2),
    floor: num(row.floor),
    floors_total: num(row.floors_total),
    price_kzt: num(row.price_kzt),
    deposit_kzt: num(row.deposit_kzt),
    furnished: bool(row.furnished),
    pets_allowed: bool(row.pets_allowed),
    kids_allowed: bool(row.kids_allowed),
    photos: parseJsonArray(String(row.photos ?? "[]")),
    amenities: parseJsonArray(String(row.amenities ?? "[]")),
    status: String(row.status),
    available_from: isoDate(row.available_from),
    created_at: isoStamp(row.created_at),
    owner_name: row.owner_name ? String(row.owner_name) : undefined,
    owner_verified: row.owner_verified === undefined ? undefined : bool(row.owner_verified),
    owner_trust: row.owner_trust === undefined ? undefined : num(row.owner_trust),
    review_avg: row.review_avg === undefined || row.review_avg === null ? undefined : num(row.review_avg),
    review_count: row.review_count === undefined ? undefined : num(row.review_count),
  };
}

export function mapProfile(row: Row): Profile {
  return {
    user_id: String(row.user_id),
    display_name: String(row.display_name ?? ""),
    role: row.role === "landlord" ? "landlord" : "renter",
    phone: String(row.phone ?? ""),
    bio: String(row.bio ?? ""),
    city: String(row.city ?? "Almaty"),
    verified: bool(row.verified),
    trust_score: num(row.trust_score),
    language: String(row.language ?? "ru"),
    created_at: isoStamp(row.created_at),
  };
}

export function mapApplication(row: Row): Application {
  return {
    id: num(row.id),
    listing_id: num(row.listing_id),
    renter_id: String(row.renter_id),
    landlord_id: String(row.landlord_id),
    message: String(row.message),
    start_date: isoDate(row.start_date),
    months: num(row.months),
    status: String(row.status),
    created_at: isoStamp(row.created_at),
    listing_title: row.listing_title ? String(row.listing_title) : undefined,
    listing_city: row.listing_city ? String(row.listing_city) : undefined,
    listing_photo: row.listing_photo ? String(row.listing_photo) : undefined,
    listing_price: row.listing_price === undefined ? undefined : num(row.listing_price),
    counterparty_name: row.counterparty_name ? String(row.counterparty_name) : undefined,
  };
}

export function mapConversation(row: Row): Conversation {
  return {
    id: num(row.id),
    listing_id: num(row.listing_id),
    renter_id: String(row.renter_id),
    landlord_id: String(row.landlord_id),
    application_id: row.application_id == null ? null : num(row.application_id),
    created_at: isoStamp(row.created_at),
    listing_title: row.listing_title ? String(row.listing_title) : undefined,
    listing_photo: row.listing_photo ? String(row.listing_photo) : undefined,
    other_name: row.other_name ? String(row.other_name) : undefined,
    last_body: row.last_body ? String(row.last_body) : undefined,
    last_at: row.last_at ? isoStamp(row.last_at) : undefined,
  };
}

export function mapMessage(row: Row): ChatMessage {
  return {
    id: num(row.id),
    conversation_id: num(row.conversation_id),
    sender_id: String(row.sender_id),
    body: String(row.body),
    created_at: isoStamp(row.created_at),
  };
}

export function mapPayment(row: Row): Payment {
  return {
    id: num(row.id),
    application_id: num(row.application_id),
    payer_id: String(row.payer_id),
    payee_id: String(row.payee_id),
    amount_kzt: num(row.amount_kzt),
    kind: String(row.kind),
    method: String(row.method),
    status: String(row.status),
    kaspi_ref: String(row.kaspi_ref ?? ""),
    created_at: isoStamp(row.created_at),
    listing_title: row.listing_title ? String(row.listing_title) : undefined,
  };
}

export function mapReview(row: Row): Review {
  return {
    id: num(row.id),
    listing_id: num(row.listing_id),
    author_id: String(row.author_id),
    rating: num(row.rating),
    body: String(row.body),
    created_at: isoStamp(row.created_at),
    author_name: row.author_name ? String(row.author_name) : undefined,
  };
}
