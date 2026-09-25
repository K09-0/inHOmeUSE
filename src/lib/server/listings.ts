import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapListing, mapReview } from "./mappers";
import { ensureProfile } from "./profiles";

const listingSelect = `
  l.*,
  p.display_name as owner_name,
  p.verified as owner_verified,
  p.trust_score as owner_trust,
  (select avg(rating)::float from reviews r where r.listing_id = l.id) as review_avg,
  (select count(*)::int from reviews r where r.listing_id = l.id) as review_count
`;

export const listListings = createServerFn({ method: "GET" })
  .validator(
    (input: {
      city?: string;
      q?: string;
      rooms?: number;
      minPrice?: number;
      maxPrice?: number;
      furnished?: boolean;
      pets?: boolean;
      sort?: string;
    }) => input ?? {},
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const city = data.city && data.city !== "all" ? data.city : null;
    const q = data.q?.trim() ? `%${data.q.trim().toLowerCase()}%` : null;
    const rooms = data.rooms && data.rooms > 0 ? data.rooms : null;
    const minPrice = data.minPrice ?? 0;
    const maxPrice = data.maxPrice ?? 10_000_000;
    const furnished = data.furnished ? true : null;
    const pets = data.pets ? true : null;
    const sort = data.sort ?? "newest";

    const rows = await sql.query(
      `select ${listingSelect}
       from listings l
       left join profiles p on p.user_id = l.owner_id
       where l.status = 'published'
         and ($1::text is null or l.city = $1)
         and ($2::text is null or lower(l.title || ' ' || l.district || ' ' || l.address) like $2)
         and ($3::int is null or l.rooms = $3)
         and l.price_kzt >= $4 and l.price_kzt <= $5
         and ($6::boolean is null or l.furnished = $6)
         and ($7::boolean is null or l.pets_allowed = $7)
       order by
         case when $8 = 'cheap' then l.price_kzt end asc,
         case when $8 = 'trust' then coalesce(p.trust_score, 0) end desc,
         l.created_at desc`,
      [city, q, rooms, minPrice, maxPrice, furnished, pets, sort],
    );
    return rows.map(mapListing);
  });

export const getListing = createServerFn({ method: "GET" })
  .validator((id: number) => id)
  .handler(async ({ data: id }) => {
    const sql = await getSql();
    const rows = await sql.query(
      `select ${listingSelect}
       from listings l
       left join profiles p on p.user_id = l.owner_id
       where l.id = $1`,
      [id],
    );
    return rows[0] ? mapListing(rows[0]) : null;
  });

export const listReviews = createServerFn({ method: "GET" })
  .validator((listingId: number) => listingId)
  .handler(async ({ data: listingId }) => {
    const sql = await getSql();
    const rows = await sql.query(
      `select r.*, coalesce(p.display_name, 'Guest') as author_name
       from reviews r
       left join profiles p on p.user_id = r.author_id
       where r.listing_id = $1
       order by r.created_at desc`,
      [listingId],
    );
    return rows.map(mapReview);
  });

export const listMyListings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    const rows = await sql.query(
      `select ${listingSelect}
       from listings l
       left join profiles p on p.user_id = l.owner_id
       where l.owner_id = $1
       order by l.created_at desc`,
      [context.userId],
    );
    return rows.map(mapListing);
  });

const createListingSchema = z.object({
  title: z.string().min(4).max(120),
  description: z.string().min(10).max(4000),
  city: z.string().min(2).max(40),
  district: z.string().min(2).max(60),
  address: z.string().min(4).max(160),
  lat: z.number(),
  lng: z.number(),
  rooms: z.number().int().min(1).max(8),
  area_m2: z.number().int().min(12).max(400),
  floor: z.number().int().min(1).max(80),
  floors_total: z.number().int().min(1).max(80),
  price_kzt: z.number().int().min(20000).max(5000000),
  deposit_kzt: z.number().int().min(0).max(5000000),
  furnished: z.boolean(),
  pets_allowed: z.boolean(),
  kids_allowed: z.boolean(),
  photos: z.array(z.string()).min(1).max(12),
  amenities: z.array(z.string()).max(20),
  available_from: z.string(),
});

export const createListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: z.infer<typeof createListingSchema>) => createListingSchema.parse(data))
  .handler(async ({ context, data }) => {
    await ensureProfile(context.userId, { role: "landlord" });
    const sql = await getSql();
    const rows = await sql.query(
      `insert into listings (
         owner_id, title, description, city, district, address, lat, lng,
         rooms, area_m2, floor, floors_total, price_kzt, deposit_kzt,
         furnished, pets_allowed, kids_allowed, photos, amenities, status, available_from
       ) values (
         $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,'published',$20
       ) returning id`,
      [
        context.userId,
        data.title,
        data.description,
        data.city,
        data.district,
        data.address,
        data.lat,
        data.lng,
        data.rooms,
        data.area_m2,
        data.floor,
        data.floors_total,
        data.price_kzt,
        data.deposit_kzt,
        data.furnished,
        data.pets_allowed,
        data.kids_allowed,
        JSON.stringify(data.photos),
        JSON.stringify(data.amenities),
        data.available_from,
      ],
    );
    return { id: Number(rows[0]?.id) };
  });

export const listBookedRanges = createServerFn({ method: "GET" })
  .validator((listingId: number) => listingId)
  .handler(async ({ data: listingId }) => {
    const sql = await getSql();
    const rows = await sql.query<{ start_date: string; months: number }>(
      `select start_date, months from applications
       where listing_id = $1 and status in ('accepted','completed')`,
      [listingId],
    );
    return rows.map((r) => ({ start: String(r.start_date).slice(0, 10), months: Number(r.months) }));
  });
