import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapListing } from "./mappers";
import { ensureProfile } from "./profiles";

export const listFavorites = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    const rows = await sql.query(
      `select l.*, p.display_name as owner_name, p.verified as owner_verified, p.trust_score as owner_trust
       from favorites f
       join listings l on l.id = f.listing_id
       left join profiles p on p.user_id = l.owner_id
       where f.user_id = $1
       order by f.created_at desc`,
      [context.userId],
    );
    return rows.map(mapListing);
  });

export const toggleFavorite = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((listingId: number) => listingId)
  .handler(async ({ context, data: listingId }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    const existing = await sql.query(
      `select listing_id from favorites where user_id = $1 and listing_id = $2`,
      [context.userId, listingId],
    );
    if (existing[0]) {
      await sql.query(`delete from favorites where user_id = $1 and listing_id = $2`, [
        context.userId,
        listingId,
      ]);
      return { saved: false };
    }
    await sql.query(`insert into favorites (user_id, listing_id) values ($1,$2)`, [
      context.userId,
      listingId,
    ]);
    return { saved: true };
  });

export const favoriteIds = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql.query<{ listing_id: number }>(
      `select listing_id from favorites where user_id = $1`,
      [context.userId],
    );
    return rows.map((r) => Number(r.listing_id));
  });
