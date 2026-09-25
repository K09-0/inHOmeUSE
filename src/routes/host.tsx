import { useEffect, useState } from "react";
import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { ListingCard } from "@/components/listings/listing-card";
import { Button } from "@/components/ui/button";
import { listMyListings } from "@/lib/server/listings";
import { listMyApplications, setApplicationStatus } from "@/lib/server/applications";
import type { Application, Listing } from "@/lib/types";
import { t, useI18n } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";

export const Route = createFileRoute("/host")({ component: HostPage });

function HostPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { lang } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [listings, setListings] = useState<Listing[]>([]);
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    if (pathname !== "/host" || !user) return;
    void listMyListings().then(setListings).catch(() => setListings([]));
    void listMyApplications()
      .then((rows) => setApps(rows.filter((a) => a.landlord_id === user.id)))
      .catch(() => setApps([]));
  }, [user, pathname]);

  if (pathname !== "/host") return <Outlet />;

  if (isPending) {
    return (
      <AppShell>
        <p className="text-muted">{t(lang, "loading")}</p>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  async function onStatus(id: number, status: "accepted" | "declined") {
    await setApplicationStatus({ data: { id, status } });
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }

  return (
    <AppShell>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl tracking-tight">{t(lang, "host")}</h1>
          <p className="mt-1 text-sm text-muted">{t(lang, "onlineOnly")}</p>
        </div>
        <Link to="/host/new">
          <Button>{t(lang, "newListing")}</Button>
        </Link>
      </div>
      <h2 className="mt-8 font-display text-2xl">{t(lang, "incoming")}</h2>
      <div className="mt-3 space-y-3">
        {apps.length === 0 && <p className="text-sm text-muted">{t(lang, "emptyApps")}</p>}
        {apps.map((app) => (
          <div key={app.id} className="flex flex-col gap-3 rounded-2xl bg-surface p-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium">{app.listing_title}</p>
              <p className="text-sm text-muted">
                {app.counterparty_name} · {app.start_date} · {app.months}m · {app.status}
              </p>
              <p className="mt-1 text-sm">{app.message}</p>
            </div>
            {app.status === "pending" && (
              <div className="flex gap-2">
                <Button size="sm" onClick={() => void onStatus(app.id, "accepted")}>{t(lang, "accept")}</Button>
                <Button size="sm" variant="secondary" onClick={() => void onStatus(app.id, "declined")}>{t(lang, "decline")}</Button>
              </div>
            )}
          </div>
        ))}
      </div>
      <h2 className="mt-10 font-display text-2xl">{t(lang, "myListings")}</h2>
      <div className="mt-4 grid gap-5 sm:grid-cols-2">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} lang={lang} />
        ))}
        {listings.length === 0 && <p className="text-sm text-muted">{t(lang, "newListing")}</p>}
      </div>
    </AppShell>
  );
}
