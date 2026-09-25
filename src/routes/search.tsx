import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ListingCard } from "@/components/listings/listing-card";
import { CityMap } from "@/components/listings/city-map";
import { CommandPalette } from "@/components/command/command-palette";
import { Input } from "@/components/ui/input";
import { listListings } from "@/lib/server/listings";
import { favoriteIds, toggleFavorite } from "@/lib/server/favorites";
import type { Listing } from "@/lib/types";
import { cityLabel, t, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/search")({ component: SearchPage });

const CITIES = ["all", "Almaty", "Astana", "Shymkent"] as const;

function SearchPage() {
  const { lang } = useI18n();
  const { user } = useCurrentUserState();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [city, setCity] = useState<string>("all");
  const [rooms, setRooms] = useState(0);
  const [sort, setSort] = useState("newest");
  const [listings, setListings] = useState<Listing[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [mode, setMode] = useState<"list" | "map">("list");

  useEffect(() => {
    const tmr = window.setTimeout(() => {
      void listListings({
        data: { q, city, rooms, sort },
      })
        .then(setListings)
        .catch(() => setListings([]));
    }, 180);
    return () => window.clearTimeout(tmr);
  }, [q, city, rooms, sort]);

  useEffect(() => {
    if (!user) return;
    void favoriteIds().then(setSaved).catch(() => setSaved([]));
  }, [user]);

  const mapCity = city === "all" ? "Almaty" : city;
  const mapListings = useMemo(
    () => listings.filter((l) => (city === "all" ? l.city === "Almaty" : l.city === city)),
    [listings, city],
  );

  async function onToggle(id: number) {
    if (!user) return;
    const res = await toggleFavorite({ data: id });
    setSaved((prev) => (res.saved ? [...prev, id] : prev.filter((x) => x !== id)));
  }

  return (
    <AppShell>
      <CommandPalette listings={listings} />
      <div className="flex flex-col gap-4">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t(lang, "search")} />
        <div className="flex flex-wrap gap-2">
          {CITIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCity(c)}
              className={cn(
                "h-10 rounded-full px-4 text-sm font-medium",
                city === c ? "bg-primary text-primary-fg" : "bg-surface shadow-[var(--shadow-border)]",
              )}
            >
              {c === "all" ? t(lang, "allCities") : cityLabel(lang, c)}
            </button>
          ))}
          {[0, 1, 2, 3].map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRooms(r)}
              className={cn(
                "h-10 rounded-full px-4 text-sm font-medium",
                rooms === r ? "bg-ink text-paper" : "bg-surface shadow-[var(--shadow-border)]",
              )}
            >
              {r === 0 ? t(lang, "anyRooms") : `${r}`}
            </button>
          ))}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="h-10 rounded-full bg-surface px-3 text-sm shadow-[var(--shadow-border)]"
          >
            <option value="newest">{t(lang, "newest")}</option>
            <option value="cheap">{t(lang, "cheap")}</option>
            <option value="trust">{t(lang, "trustSort")}</option>
          </select>
          <div className="ml-auto flex rounded-full bg-fg/5 p-1">
            <button type="button" onClick={() => setMode("list")} className={cn("h-8 rounded-full px-3 text-xs", mode === "list" && "bg-primary text-primary-fg")}>
              {t(lang, "list")}
            </button>
            <button type="button" onClick={() => setMode("map")} className={cn("h-8 rounded-full px-3 text-xs", mode === "map" && "bg-primary text-primary-fg")}>
              {t(lang, "map")}
            </button>
          </div>
        </div>
      </div>

      {mode === "map" && (
        <div className="mt-5">
          <CityMap
            city={mapCity}
            listings={mapListings}
            activeId={activeId}
            onSelect={(id) => {
              setActiveId(id);
              void navigate({ to: "/listing/$id", params: { id: String(id) } });
            }}
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {listings.length === 0 && <p className="text-sm text-muted">{t(lang, "emptyListings")}</p>}
        {listings.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            lang={lang}
            saved={saved.includes(listing.id)}
            onToggleSave={user ? onToggle : undefined}
          />
        ))}
      </div>
    </AppShell>
  );
}
