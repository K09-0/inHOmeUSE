import { useMemo } from "react";
import type { Listing } from "@/lib/types";
import { cn } from "@/lib/utils";

const BOUNDS: Record<string, { minLat: number; maxLat: number; minLng: number; maxLng: number }> = {
  Almaty: { minLat: 43.17, maxLat: 43.28, minLng: 76.84, maxLng: 77.02 },
  Astana: { minLat: 51.08, maxLat: 51.18, minLng: 71.35, maxLng: 71.52 },
  Shymkent: { minLat: 42.28, maxLat: 42.38, minLng: 69.52, maxLng: 69.68 },
};

function project(listing: Listing, city: string) {
  const b = BOUNDS[city] ?? BOUNDS.Almaty;
  const x = ((listing.lng - b.minLng) / (b.maxLng - b.minLng)) * 100;
  const y = (1 - (listing.lat - b.minLat) / (b.maxLat - b.minLat)) * 100;
  return { x: Math.min(92, Math.max(8, x)), y: Math.min(88, Math.max(10, y)) };
}

export function CityMap({
  city,
  listings,
  activeId,
  onSelect,
}: {
  city: string;
  listings: Listing[];
  activeId?: number | null;
  onSelect?: (id: number) => void;
}) {
  const pins = useMemo(
    () => listings.filter((l) => (city === "all" ? true : l.city === city)),
    [listings, city],
  );
  const mapCity = city === "all" ? "Almaty" : city;

  return (
    <div className="relative overflow-hidden rounded-[28px] bg-[#efe6df] shadow-[var(--shadow-border)]">
      <svg viewBox="0 0 100 72" className="h-[280px] w-full sm:h-[360px]" preserveAspectRatio="none">
        <rect width="100" height="72" fill="#efe6df" />
        {mapCity === "Almaty" && (
          <>
            <path d="M0 58 C18 50 32 62 50 54 C68 46 82 60 100 52 L100 72 L0 72 Z" fill="#d9c7bc" />
            <path d="M0 62 C22 56 40 66 58 58 C76 50 88 64 100 58 L100 72 L0 72 Z" fill="#E30613" opacity="0.18" />
          </>
        )}
        {mapCity === "Astana" && (
          <path d="M0 34 C20 30 40 38 60 32 C80 26 90 36 100 30 L100 40 C80 44 60 36 40 42 C20 48 10 40 0 44 Z" fill="#c9d6e2" />
        )}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={8 + i * 8} x2="100" y2={8 + i * 8} stroke="#1a1214" strokeOpacity="0.05" />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={6 + i * 10} y1="0" x2={6 + i * 10} y2="72" stroke="#1a1214" strokeOpacity="0.04" />
        ))}
      </svg>
      {pins.map((listing) => {
        const { x, y } = project(listing, mapCity);
        const active = listing.id === activeId;
        return (
          <button
            key={listing.id}
            type="button"
            onClick={() => onSelect?.(listing.id)}
            style={{ left: `${x}%`, top: `${y}%` }}
            className={cn(
              "absolute -translate-x-1/2 -translate-y-1/2 transition-transform duration-150",
              active ? "z-10 scale-110" : "z-0",
            )}
            aria-label={listing.title}
          >
            <span
              className={cn(
                "grid size-9 place-items-center rounded-full shadow-[var(--shadow-border)]",
                active ? "bg-primary text-primary-fg" : "bg-surface text-primary",
              )}
            >
              <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
                <circle cx="8" cy="7" r="3.2" fill="currentColor" />
                <path d="M8 10.2v6h2.2l1.6-1.8 1.4 1.2.9-1.1-1.4-1.2 1.1-1.2-.9-.9-2.7 2.9H10V12H8.8v1.4H7.2v-3.2Z" fill="currentColor" />
              </svg>
            </span>
          </button>
        );
      })}
      <p className="absolute left-4 top-4 rounded-full bg-surface/85 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-muted backdrop-blur-md">
        {mapCity}
      </p>
    </div>
  );
}
