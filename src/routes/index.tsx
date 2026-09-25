import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ListingCard } from "@/components/listings/listing-card";
import { CommandPalette } from "@/components/command/command-palette";
import { Button } from "@/components/ui/button";
import { listListings } from "@/lib/server/listings";
import { favoriteIds, toggleFavorite } from "@/lib/server/favorites";
import type { Listing } from "@/lib/types";
import { t, useI18n } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { lang } = useI18n();
  const { user } = useCurrentUserState();
  const [listings, setListings] = useState<Listing[]>([]);
  const [saved, setSaved] = useState<number[]>([]);

  useEffect(() => {
    void listListings({ data: { sort: "trust" } }).then(setListings).catch(() => setListings([]));
  }, []);
  useEffect(() => {
    if (!user) return;
    void favoriteIds().then(setSaved).catch(() => setSaved([]));
  }, [user]);

  async function onToggle(id: number) {
    if (!user) return;
    const res = await toggleFavorite({ data: id });
    setSaved((prev) => (res.saved ? [...prev, id] : prev.filter((x) => x !== id)));
  }

  return (
    <AppShell>
      <CommandPalette listings={listings} />
      <section className="stagger-in overflow-hidden rounded-[32px] bg-ink px-6 py-10 text-paper sm:px-10 sm:py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">{t(lang, "noMeetings")}</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] tracking-[-0.04em] sm:text-6xl">
          {t(lang, "tagline")}
        </h1>
        <p className="mt-4 max-w-xl text-base text-paper/75 sm:text-lg">{t(lang, "heroLead")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/search">
            <Button size="lg">{t(lang, "browse")}</Button>
          </Link>
          <Link to="/host">
            <Button size="lg" variant="secondary" className="bg-paper text-ink">
              {t(lang, "becomeHost")}
            </Button>
          </Link>
        </div>
      </section>

      <section className="mt-12 grid gap-4 sm:grid-cols-3">
        {[t(lang, "step1"), t(lang, "step2"), t(lang, "step3")].map((text, i) => (
          <div key={text} className="rounded-[24px] bg-surface p-5 shadow-[var(--shadow-border)]">
            <p className="font-display text-3xl text-primary">0{i + 1}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
          </div>
        ))}
      </section>

      <section className="mt-12">
        <div className="mb-5 flex items-end justify-between">
          <h2 className="font-display text-3xl tracking-tight">{t(lang, "featured")}</h2>
          <Link to="/search" className="text-sm font-medium text-primary">
            {t(lang, "search")}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.slice(0, 6).map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              lang={lang}
              saved={saved.includes(listing.id)}
              onToggleSave={user ? onToggle : undefined}
            />
          ))}
        </div>
      </section>
    </AppShell>
  );
}
