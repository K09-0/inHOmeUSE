import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createListing } from "@/lib/server/listings";
import { t, useI18n } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";

export const Route = createFileRoute("/host/new")({ component: NewListing });

const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Almaty: { lat: 43.238, lng: 76.945 },
  Astana: { lat: 51.128, lng: 71.43 },
  Shymkent: { lat: 42.32, lng: 69.59 },
};

function NewListing() {
  const { lang } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    city: "Almaty",
    district: "",
    address: "",
    rooms: 2,
    area_m2: 60,
    floor: 4,
    floors_total: 9,
    price_kzt: 200000,
    deposit_kzt: 200000,
    furnished: true,
    pets_allowed: false,
    kids_allowed: true,
    photos: "",
    available_from: "2026-09-01",
  });

  if (isPending) {
    return (
      <AppShell>
        <p className="text-muted">{t(lang, "loading")}</p>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const coords = CITY_COORDS[form.city] ?? CITY_COORDS.Almaty;
      const photos = form.photos
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      const fallback = [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1400&q=80",
      ];
      const res = await createListing({
        data: {
          title: form.title,
          description: form.description,
          city: form.city,
          district: form.district,
          address: form.address,
          lat: coords.lat + Math.random() * 0.02,
          lng: coords.lng + Math.random() * 0.02,
          rooms: Number(form.rooms),
          area_m2: Number(form.area_m2),
          floor: Number(form.floor),
          floors_total: Number(form.floors_total),
          price_kzt: Number(form.price_kzt),
          deposit_kzt: Number(form.deposit_kzt),
          furnished: form.furnished,
          pets_allowed: form.pets_allowed,
          kids_allowed: form.kids_allowed,
          photos: photos.length ? photos : fallback,
          amenities: ["wifi", "washer"],
          available_from: form.available_from,
        },
      });
      void navigate({ to: "/listing/$id", params: { id: String(res.id) } });
    } catch (err) {
      setError(err instanceof Error ? err.message : t(lang, "errorGeneric"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <h1 className="font-display text-4xl tracking-tight">{t(lang, "newListing")}</h1>
      <form className="mt-6 grid max-w-2xl gap-4" onSubmit={onSubmit}>
        <div>
          <Label>{t(lang, "title")}</Label>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} required minLength={4} />
        </div>
        <div>
          <Label>{t(lang, "description")}</Label>
          <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} required minLength={10} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>{t(lang, "city")}</Label>
            <select
              className="h-11 w-full rounded-xl bg-surface px-3 shadow-[var(--shadow-border)]"
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
            >
              <option>Almaty</option>
              <option>Astana</option>
              <option>Shymkent</option>
            </select>
          </div>
          <div>
            <Label>{t(lang, "district")}</Label>
            <Input value={form.district} onChange={(e) => set("district", e.target.value)} required />
          </div>
        </div>
        <div>
          <Label>{t(lang, "address")}</Label>
          <Input value={form.address} onChange={(e) => set("address", e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <Label>{t(lang, "rooms")}</Label>
            <Input type="number" value={form.rooms} onChange={(e) => set("rooms", Number(e.target.value))} />
          </div>
          <div>
            <Label>{t(lang, "area")}</Label>
            <Input type="number" value={form.area_m2} onChange={(e) => set("area_m2", Number(e.target.value))} />
          </div>
          <div>
            <Label>{t(lang, "floor")}</Label>
            <Input type="number" value={form.floor} onChange={(e) => set("floor", Number(e.target.value))} />
          </div>
          <div>
            <Label>{t(lang, "price")}</Label>
            <Input type="number" value={form.price_kzt} onChange={(e) => set("price_kzt", Number(e.target.value))} />
          </div>
        </div>
        <div>
          <Label>{t(lang, "photos")}</Label>
          <Input value={form.photos} onChange={(e) => set("photos", e.target.value)} placeholder={t(lang, "photosHint")} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.furnished} onChange={(e) => set("furnished", e.target.checked)} />
          {t(lang, "furnished")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.pets_allowed} onChange={(e) => set("pets_allowed", e.target.checked)} />
          {t(lang, "pets")}
        </label>
        {error && <p className="text-sm text-primary">{error}</p>}
        <Button type="submit" disabled={busy}>{t(lang, "publish")}</Button>
      </form>
    </AppShell>
  );
}
