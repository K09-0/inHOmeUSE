import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapApplication } from "./mappers";
import { ensureProfile } from "./profiles";

const appSelect = `
  a.*,
  l.title as listing_title,
  l.city as listing_city,
  l.price_kzt as listing_price,
  (l.photos::json->>0) as listing_photo
`;

export const listMyApplications = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    const rows = await sql.query(
      `select ${appSelect},
         case when a.renter_id = $1 then coalesce(lp.display_name, 'Host')
              else coalesce(rp.display_name, 'Renter') end as counterparty_name
       from applications a
       join listings l on l.id = a.listing_id
       left join profiles lp on lp.user_id = a.landlord_id
       left join profiles rp on rp.user_id = a.renter_id
       where a.renter_id = $1 or a.landlord_id = $1
       order by a.created_at desc`,
      [context.userId],
    );
    return rows.map(mapApplication);
  });

export const createApplication = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: { listingId: number; message: string; startDate: string; months: number }) =>
      z
        .object({
          listingId: z.number().int(),
          message: z.string().min(8).max(800),
          startDate: z.string().min(8),
          months: z.number().int().min(1).max(24),
        })
        .parse(data),
  )
  .handler(async ({ context, data }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    const listing = await sql.query<{ id: number; owner_id: string; title: string }>(
      `select id, owner_id, title from listings where id = $1 and status = 'published'`,
      [data.listingId],
    );
    const home = listing[0];
    if (!home) throw new Error("Listing not found");
    if (home.owner_id === context.userId) throw new Error("Cannot apply to your own listing");

    const inserted = await sql.query<{ id: number }>(
      `insert into applications (listing_id, renter_id, landlord_id, message, start_date, months, status)
       values ($1,$2,$3,$4,$5,$6,'pending')
       returning id`,
      [data.listingId, context.userId, home.owner_id, data.message, data.startDate, data.months],
    );
    const applicationId = Number(inserted[0]!.id);

    const conv = await sql.query<{ id: number }>(
      `insert into conversations (listing_id, renter_id, landlord_id, application_id)
       values ($1,$2,$3,$4)
       on conflict (listing_id, renter_id) do update set application_id = excluded.application_id
       returning id`,
      [data.listingId, context.userId, home.owner_id, applicationId],
    );
    const conversationId = Number(conv[0]!.id);

    await sql.query(
      `insert into messages (conversation_id, sender_id, body) values ($1,$2,$3)`,
      [conversationId, context.userId, data.message],
    );

    if (String(home.owner_id).startsWith("seed-")) {
      await sql.query(
        `insert into messages (conversation_id, sender_id, body) values ($1,$2,$3)`,
        [
          conversationId,
          home.owner_id,
          "Здравствуйте! Заявку вижу. Оформим без встречи: договор в приложении, залог — Kaspi, ключ — код smart-lock.",
        ],
      );
    }

    return { applicationId, conversationId };
  });

export const setApplicationStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { id: number; status: "accepted" | "declined" }) =>
    z.object({ id: z.number().int(), status: z.enum(["accepted", "declined"]) }).parse(data),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql.query<{ id: number; landlord_id: string; renter_id: string; listing_id: number }>(
      `select id, landlord_id, renter_id, listing_id from applications where id = $1`,
      [data.id],
    );
    const app = rows[0];
    if (!app || app.landlord_id !== context.userId) throw new Error("Forbidden");
    await sql.query(`update applications set status = $2 where id = $1 and landlord_id = $3`, [
      data.id,
      data.status,
      context.userId,
    ]);

    if (data.status === "accepted") {
      const listing = await sql.query<{ deposit_kzt: number; title: string }>(
        `select deposit_kzt, title from listings where id = $1`,
        [app.listing_id],
      );
      const deposit = Number(listing[0]?.deposit_kzt ?? 0);
      const existing = await sql.query(
        `select id from payments where application_id = $1 and kind = 'deposit'`,
        [data.id],
      );
      if (!existing[0] && deposit > 0) {
        const ref = `KSP-${Date.now().toString(36).toUpperCase()}`;
        await sql.query(
          `insert into payments (application_id, payer_id, payee_id, amount_kzt, kind, method, status, kaspi_ref)
           values ($1,$2,$3,$4,'deposit','kaspi','pending',$5)`,
          [data.id, app.renter_id, app.landlord_id, deposit, ref],
        );
      }
      const conv = await sql.query<{ id: number }>(
        `select id from conversations where listing_id = $1 and renter_id = $2`,
        [app.listing_id, app.renter_id],
      );
      if (conv[0]) {
        await sql.query(`insert into messages (conversation_id, sender_id, body) values ($1,$2,$3)`, [
          conv[0].id,
          context.userId,
          "Заявка принята. Оплатите залог в Kaspi — после этого отправим код от двери.",
        ]);
      }
    }
    return { ok: true };
  });

export const addReview = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { listingId: number; applicationId: number; rating: number; body: string }) =>
    z
      .object({
        listingId: z.number().int(),
        applicationId: z.number().int(),
        rating: z.number().int().min(1).max(5),
        body: z.string().min(4).max(600),
      })
      .parse(data),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const app = await sql.query<{ renter_id: string; landlord_id: string; status: string }>(
      `select renter_id, landlord_id, status from applications where id = $1`,
      [data.applicationId],
    );
    const row = app[0];
    if (!row || (row.renter_id !== context.userId && row.landlord_id !== context.userId)) {
      throw new Error("Forbidden");
    }
    const target = row.renter_id === context.userId ? row.landlord_id : row.renter_id;
    await sql.query(
      `insert into reviews (listing_id, application_id, author_id, target_id, rating, body)
       values ($1,$2,$3,$4,$5,$6)`,
      [data.listingId, data.applicationId, context.userId, target, data.rating, data.body],
    );
    return { ok: true };
  });
