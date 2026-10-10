import { useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PhotoPicker } from "@/components/listings/photo-picker";
import { createListing } from "@/lib/server/listings";
import { t, useI18n } from "@/lib/i18n";
import { CITIES, REGIONS, citiesIn, placeName } from "@/lib/geo/kz";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";

export const Route = createFileRoute("/host/new")({ component: NewListing });

function NewListing() {
  const { lang } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    region: "almaty-city",
    city: "Almaty",
    district: "Almaly",
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
    photos: [] as string[],
    available_from: "2026-10-01",
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

  const cities = citiesIn(form.region);
  const place = CITIES.find((item) => item.id === form.city) ?? cities[0];

  function onRegion(region: string) {
    const next = citiesIn(region)[0];
    setForm((prev) => ({
      ...prev,
      region,
      city: next?.id ?? prev.city,
      district: next?.districts[0]?.id ?? prev.district,
    }));
  }

  function onCity(cityId: string) {
    const next = CITIES.find((item) => item.id === cityId);
    setForm((prev) => ({ ...prev, city: cityId, district: next?.districts[0]?.id ?? prev.district }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.photos.length === 0) {
      setError(t(lang, "needPhoto"));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const coords = place ?? CITIES[0]!;
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
          photos: form.photos,
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

  const selectClass = "h-11 w-full rounded-xl bg-surface px-3 shadow-[var(--shadow-border)]";

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
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>{t(lang, "region")}</Label>
            <select className={selectClass} value={form.region} onChange={(e) => onRegion(e.target.value)}>
              {REGIONS.map((region) => (
                <option key={region.id} value={region.id}>
                  {placeName(lang, region)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>{t(lang, "city")}</Label>
            <select className={selectClass} value={form.city} onChange={(e) => onCity(e.target.value)}>
              {cities.map((item) => (
                <option key={item.id} value={item.id}>
                  {placeName(lang, item)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>{t(lang, "district")}</Label>
            <select className={selectClass} value={form.district} onChange={(e) => set("district", e.target.value)}>
              {(place?.districts ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {placeName(lang, item)}
                </option>
              ))}
            </select>
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
        <PhotoPicker lang={lang} photos={form.photos} onChange={(photos) => set("photos", photos)} />
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
