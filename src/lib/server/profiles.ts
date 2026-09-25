import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { mapProfile } from "./mappers";
import type { Profile, UserRole } from "@/lib/types";

export async function ensureProfile(
  userId: string,
  opts?: { role?: UserRole; name?: string },
): Promise<Profile> {
  const sql = await getSql();
  const existing = await sql.query(`select * from profiles where user_id = $1`, [userId]);
  if (existing[0]) {
    if (opts?.role === "landlord" && existing[0].role !== "landlord") {
      await sql.query(`update profiles set role = 'landlord' where user_id = $1`, [userId]);
      const updated = await sql.query(`select * from profiles where user_id = $1`, [userId]);
      return mapProfile(updated[0]!);
    }
    return mapProfile(existing[0]);
  }
  await sql.query(
    `insert into profiles (user_id, display_name, role)
     values ($1, $2, $3)
     on conflict (user_id) do nothing`,
    [userId, opts?.name ?? "Guest", opts?.role ?? "renter"],
  );
  const rows = await sql.query(`select * from profiles where user_id = $1`, [userId]);
  return mapProfile(rows[0]!);
}

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => ensureProfile(context.userId));

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (data: {
      display_name: string;
      role: UserRole;
      phone: string;
      bio: string;
      city: string;
      language: string;
    }) =>
      z
        .object({
          display_name: z.string().min(1).max(80),
          role: z.enum(["renter", "landlord"]),
          phone: z.string().max(32),
          bio: z.string().max(500),
          city: z.string().max(40),
          language: z.string().max(8),
        })
        .parse(data),
  )
  .handler(async ({ context, data }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    await sql.query(
      `update profiles
       set display_name = $2, role = $3, phone = $4, bio = $5, city = $6, language = $7
       where user_id = $1`,
      [context.userId, data.display_name, data.role, data.phone, data.bio, data.city, data.language],
    );
    return ensureProfile(context.userId);
  });

export const verifyMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureProfile(context.userId);
    const sql = await getSql();
    await sql.query(
      `update profiles
       set verified = true, trust_score = greatest(trust_score, 78)
       where user_id = $1`,
      [context.userId],
    );
    return ensureProfile(context.userId);
  });
