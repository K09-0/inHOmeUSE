import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapConversation, mapMessage } from "./mappers";
import { ensureProfile } from "./profiles";

export const listConversations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    const rows = await sql.query(
      `select c.*,
              l.title as listing_title,
              (l.photos::json->>0) as listing_photo,
              case when c.renter_id = $1 then coalesce(lp.display_name, 'Host')
                   else coalesce(rp.display_name, 'Renter') end as other_name,
              (select body from messages m where m.conversation_id = c.id order by id desc limit 1) as last_body,
              (select created_at from messages m where m.conversation_id = c.id order by id desc limit 1) as last_at
       from conversations c
       join listings l on l.id = c.listing_id
       left join profiles lp on lp.user_id = c.landlord_id
       left join profiles rp on rp.user_id = c.renter_id
       where c.renter_id = $1 or c.landlord_id = $1
       order by coalesce(
         (select created_at from messages m where m.conversation_id = c.id order by id desc limit 1),
         c.created_at
       ) desc`,
      [context.userId],
    );
    return rows.map(mapConversation);
  });

export const getConversation = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const conv = await sql.query(
      `select c.*,
              l.title as listing_title,
              (l.photos::json->>0) as listing_photo,
              case when c.renter_id = $2 then coalesce(lp.display_name, 'Host')
                   else coalesce(rp.display_name, 'Renter') end as other_name
       from conversations c
       join listings l on l.id = c.listing_id
       left join profiles lp on lp.user_id = c.landlord_id
       left join profiles rp on rp.user_id = c.renter_id
       where c.id = $1 and (c.renter_id = $2 or c.landlord_id = $2)`,
      [id, context.userId],
    );
    if (!conv[0]) return null;
    const messages = await sql.query(
      `select * from messages where conversation_id = $1 order by id asc`,
      [id],
    );
    return { conversation: mapConversation(conv[0]), messages: messages.map(mapMessage) };
  });

export const sendMessage = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((data: { conversationId: number; body: string }) =>
    z.object({ conversationId: z.number().int(), body: z.string().min(1).max(2000) }).parse(data),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const conv = await sql.query<{ id: number; landlord_id: string; renter_id: string }>(
      `select id, landlord_id, renter_id from conversations
       where id = $1 and (renter_id = $2 or landlord_id = $2)`,
      [data.conversationId, context.userId],
    );
    const row = conv[0];
    if (!row) throw new Error("Forbidden");
    const inserted = await sql.query(
      `insert into messages (conversation_id, sender_id, body) values ($1,$2,$3) returning *`,
      [data.conversationId, context.userId, data.body.trim()],
    );
    if (row.landlord_id.startsWith("seed-") && context.userId === row.renter_id) {
      await sql.query(`insert into messages (conversation_id, sender_id, body) values ($1,$2,$3)`, [
        data.conversationId,
        row.landlord_id,
        "Принято. Если готовы — подтвердите заявку ключом и оплатите залог Kaspi. Код от двери придёт сразу после платежа.",
      ]);
    }
    return mapMessage(inserted[0]!);
  });
