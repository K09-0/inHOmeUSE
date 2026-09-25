import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ListingCard } from "@/components/listings/listing-card";
import { listFavorites, toggleFavorite } from "@/lib/server/favorites";
import type { Listing } from "@/lib/types";
import { t, useI18n } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";

export const Route = createFileRoute("/favorites")({ component: FavoritesPage });

function FavoritesPage() {
  const { lang } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [items, setItems] = useState<Listing[]>([]);

  useEffect(() => {
    if (!user) return;
    void listFavorites().then(setItems).catch(() => setItems([]));
  }, [user]);

  if (isPending) {
    return (
      <AppShell>
        <p className="text-muted">{t(lang, "loading")}</p>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <AppShell>
      <h1 className="font-display text-4xl tracking-tight">{t(lang, "favorites")}</h1>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.length === 0 && <p className="text-sm text-muted">{t(lang, "emptyListings")}</p>}
        {items.map((listing) => (
          <ListingCard
            key={listing.id}
            listing={listing}
            lang={lang}
            saved
            onToggleSave={(id) => {
              void toggleFavorite({ data: id }).then(() =>
                setItems((prev) => prev.filter((x) => x.id !== id)),
              );
            }}
          />
        ))}
      </div>
    </AppShell>
  );
}
