import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapPayment } from "./mappers";
import { ensureProfile } from "./profiles";

export const listMyPayments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    const rows = await sql.query(
      `select p.*, l.title as listing_title
       from payments p
       join applications a on a.id = p.application_id
       join listings l on l.id = a.listing_id
       where p.payer_id = $1 or p.payee_id = $1
       order by p.created_at desc`,
      [context.userId],
    );
    return rows.map(mapPayment);
  });

export const confirmKaspiPayment = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: number) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const rows = await sql.query<{
      id: number;
      payer_id: string;
      payee_id: string;
      status: string;
      application_id: number;
    }>(`select id, payer_id, payee_id, status, application_id from payments where id = $1`, [id]);
    const pay = rows[0];
    if (!pay || pay.payer_id !== context.userId) throw new Error("Forbidden");
    if (pay.status === "paid") return { ok: true, already: true };

    await sql.query(`update payments set status = 'paid' where id = $1 and payer_id = $2`, [
      id,
      context.userId,
    ]);

    const conv = await sql.query<{ id: number }>(
      `select c.id from conversations c
       join applications a on a.id = $1
       where c.listing_id = a.listing_id and c.renter_id = a.renter_id`,
      [pay.application_id],
    );
    const code = String(100000 + (id * 7919) % 900000);
    if (conv[0]) {
      await sql.query(`insert into messages (conversation_id, sender_id, body) values ($1,$2,$3)`, [
        conv[0].id,
        pay.payee_id,
        `Оплата Kaspi получена. Код smart-lock: ${code}. Договор активен. Встреча не нужна.`,
      ]);
    }
    return { ok: true, lockCode: code };
  });
