import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { TrustLock } from "@/components/listings/trust-lock";
import { KeySwipe } from "@/components/apply/key-swipe";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getListing, listBookedRanges, listReviews } from "@/lib/server/listings";
import { createApplication } from "@/lib/server/applications";
import { toggleFavorite } from "@/lib/server/favorites";
import type { Listing, Review } from "@/lib/types";
import { cityLabel, t, tMaybe, useI18n } from "@/lib/i18n";
import { formatKzt } from "@/lib/utils";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";

export const Route = createFileRoute("/listing/$id")({ component: ListingPage });

function ListingPage() {
  const { id } = Route.useParams();
  const listingId = Number(id);
  const { lang } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [photo, setPhoto] = useState(0);
  const [message, setMessage] = useState("");
  const [startDate, setStartDate] = useState("2026-09-01");
  const [months, setMonths] = useState(12);
  const [busy, setBusy] = useState(false);
  const [needAuth, setNeedAuth] = useState(false);
  const [booked, setBooked] = useState<{ start: string; months: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getListing({ data: listingId }).then(setListing);
    void listReviews({ data: listingId }).then(setReviews);
    void listBookedRanges({ data: listingId }).then(setBooked);
  }, [listingId]);

  if (needAuth) {
    if (isPending) return null;
    if (!user) return <RedirectToSignIn />;
  }

  if (!listing) {
    return (
      <AppShell>
        <p className="text-muted">{t(lang, "loading")}</p>
      </AppShell>
    );
  }

  async function apply() {
    if (!user) {
      setNeedAuth(true);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await createApplication({
        data: {
          listingId,
          message: message || "Хочу арендовать онлайн, без встречи. Готов подписать договор и оплатить Kaspi.",
          startDate,
          months,
        },
      });
      void navigate({ to: "/chats/$id", params: { id: String(res.conversationId) } });
    } catch (err) {
      setError(err instanceof Error ? err.message : t(lang, "errorGeneric"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <div className="overflow-hidden rounded-[28px] bg-surface shadow-[var(--shadow-border)]">
            <img
              src={listing.photos[photo] ?? listing.photos[0]}
              alt={listing.title}
              className="aspect-[16/10] w-full object-cover"
            />
            <div className="flex gap-2 overflow-x-auto p-3">
              {listing.photos.map((src, i) => (
                <button key={src} type="button" onClick={() => setPhoto(i)} className="shrink-0">
                  <img src={src} alt="" className="h-16 w-20 rounded-xl object-cover" />
                </button>
              ))}
            </div>
          </div>
          <h1 className="mt-6 font-display text-4xl tracking-tight">{listing.title}</h1>
          <p className="mt-2 text-muted">
            {cityLabel(lang, listing.city)} · {listing.district} · {listing.address}
          </p>
          <p className="mt-4 max-w-2xl leading-relaxed text-fg/90">{listing.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {listing.amenities.map((a) => (
                <span key={a} className="rounded-full bg-surface px-3 py-1.5 text-xs font-medium shadow-[var(--shadow-border)]">
                  {tMaybe(lang, `amenity_${a}`, a)}
                </span>
              ))}
          </div>
          <div className="mt-8">
            <h2 className="font-display text-2xl">{t(lang, "occupancy")}</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {booked.length === 0 && <p className="text-sm text-muted">—</p>}
              {booked.map((b) => (
                <span key={b.start} className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {b.start} · {b.months}m
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="font-display text-2xl">{t(lang, "reviews")}</h2>
            <div className="mt-3 space-y-3">
              {reviews.length === 0 && <p className="text-sm text-muted">{t(lang, "noReviews")}</p>}
              {reviews.map((r) => (
                <div key={r.id} className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-border)]">
                  <p className="text-sm font-medium">{r.author_name} · {r.rating}/5</p>
                  <p className="mt-1 text-sm text-muted">{r.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <aside className="h-fit rounded-[28px] bg-surface p-5 shadow-[var(--shadow-border)] lg:sticky lg:top-24">
          <p className="font-display text-3xl tabular-nums">
            {formatKzt(listing.price_kzt)}
            <span className="text-base text-muted">{t(lang, "perMonth")}</span>
          </p>
          <p className="mt-1 text-sm text-muted">
            {t(lang, "deposit")}: {formatKzt(listing.deposit_kzt)}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <TrustLock score={listing.owner_trust ?? 50} verified={listing.owner_verified} />
            <span className="text-sm">{listing.owner_name}</span>
          </div>
          <div className="mt-5 space-y-3">
            <div>
              <Label>{t(lang, "startDate")}</Label>
              <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
              <Label>{t(lang, "months")}</Label>
              <Input type="number" min={1} max={24} value={months} onChange={(e) => setMonths(Number(e.target.value))} />
            </div>
            <div>
              <Label>{t(lang, "motivation")}</Label>
              <Textarea value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            {error && <p className="text-sm text-primary">{error}</p>}
            <KeySwipe lang={lang} disabled={busy} onConfirm={() => void apply()} />
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => {
                if (!user) {
                  void navigate({ to: "/login" });
                  return;
                }
                void toggleFavorite({ data: listingId });
              }}
            >
              {t(lang, "favorites")}
            </Button>
            <Link to="/applications" className="block text-center text-xs text-muted">
              {t(lang, "applications")}
            </Link>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}
