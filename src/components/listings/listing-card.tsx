import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Listing } from "@/lib/types";
import { cn, formatKzt } from "@/lib/utils";
import { cityLabel, t, type Lang } from "@/lib/i18n";
import { TrustLock } from "./trust-lock";

export function ListingCard({
  listing,
  lang,
  saved,
  onToggleSave,
}: {
  listing: Listing;
  lang: Lang;
  saved?: boolean;
  onToggleSave?: (id: number) => void;
}) {
  const photo = listing.photos[0];
  return (
    <article className="group relative min-w-0 overflow-hidden rounded-[28px] bg-surface shadow-[var(--shadow-border)] transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]">
      <Link to="/listing/$id" params={{ id: String(listing.id) }} className="block min-w-0">
        <div className="relative m-1.5 aspect-[4/3] overflow-hidden rounded-[22px]">
          {photo ? (
            <img
              src={photo}
              alt={listing.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="h-full w-full bg-line" />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-transparent" />
          <div className="absolute left-3 top-3 flex max-w-[70%] flex-wrap gap-1">
            <span className="truncate rounded-full bg-surface/90 px-3 py-1 text-xs font-medium text-fg backdrop-blur-md">
              {cityLabel(lang, listing.city)} · {listing.district}
            </span>
            <span className="shrink-0 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-fg tabular-nums">
              {formatKzt(listing.price_kzt)}
            </span>
          </div>
        </div>
        <div className="relative z-10 mx-3 -mt-5 rounded-2xl px-4 py-3 glass-card">
          <h3 className="truncate font-display text-lg leading-tight tracking-tight text-fg">{listing.title}</h3>
          <p className="mt-1 text-sm text-muted">
            {listing.rooms} · {listing.area_m2} m² · {listing.floor}/{listing.floors_total}
          </p>
        </div>
        <div className="flex items-center justify-between px-4 pb-4 pt-3">
          <TrustLock score={listing.owner_trust ?? 50} verified={listing.owner_verified} />
          <span className="truncate text-xs uppercase tracking-[0.14em] text-muted">{listing.owner_name}</span>
        </div>
      </Link>
      {onToggleSave && (
        <button
          type="button"
          aria-label={t(lang, "favorites")}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleSave(listing.id);
          }}
          className={cn(
            "absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-surface/90 text-fg backdrop-blur-md transition-colors",
            saved && "text-primary",
          )}
        >
          <Heart className={cn("size-5", saved && "fill-primary")} />
        </button>
      )}
    </article>
  );
}
