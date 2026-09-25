import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addReview, listMyApplications } from "@/lib/server/applications";
import { listMyPayments } from "@/lib/server/payments";
import type { Application, Payment } from "@/lib/types";
import { t, useI18n, type Lang } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { formatKzt } from "@/lib/utils";

export const Route = createFileRoute("/applications")({ component: ApplicationsPage });

function ApplicationsPage() {
  const { lang } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [apps, setApps] = useState<Application[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [reviewFor, setReviewFor] = useState<number | null>(null);
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!user) return;
    void listMyApplications().then(setApps).catch(() => setApps([]));
    void listMyPayments().then(setPayments).catch(() => setPayments([]));
  }, [user]);

  if (isPending) {
    return (
      <AppShell>
        <p className="text-muted">{t(lang, "loading")}</p>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const outgoing = apps.filter((a) => a.renter_id === user.id);
  const incoming = apps.filter((a) => a.landlord_id === user.id);

  return (
    <AppShell>
      <h1 className="font-display text-4xl tracking-tight">{t(lang, "applications")}</h1>
      <Section title={t(lang, "outgoing")} items={outgoing} lang={lang} userId={user.id} payments={payments} reviewFor={reviewFor} setReviewFor={setReviewFor} body={body} setBody={setBody} />
      <Section title={t(lang, "incoming")} items={incoming} lang={lang} userId={user.id} payments={payments} reviewFor={reviewFor} setReviewFor={setReviewFor} body={body} setBody={setBody} />
    </AppShell>
  );
}

function Section({
  title,
  items,
  lang,
  userId,
  payments,
  reviewFor,
  setReviewFor,
  body,
  setBody,
}: {
  title: string;
  items: Application[];
  lang: Lang;
  userId: string;
  payments: Payment[];
  reviewFor: number | null;
  setReviewFor: (id: number | null) => void;
  body: string;
  setBody: (v: string) => void;
}) {
  return (
    <section className="mt-8">
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-3 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted">{t(lang, "emptyApps")}</p>}
        {items.map((app) => {
          const pay = payments.find((p) => p.application_id === app.id);
          return (
            <div key={app.id} className="rounded-2xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{app.listing_title}</p>
                  <p className="text-sm text-muted">
                    {app.listing_city} · {app.start_date} · {app.status}
                    {app.listing_price ? ` · ${formatKzt(app.listing_price)}` : ""}
                  </p>
                </div>
                <Link to="/listing/$id" params={{ id: String(app.listing_id) }} className="text-sm text-primary">
                  {t(lang, "view")}
                </Link>
              </div>
              {pay && pay.payer_id === userId && pay.status === "pending" && (
                <Link to="/payments" className="mt-3 inline-block">
                  <Button size="sm">{t(lang, "payKaspi")}</Button>
                </Link>
              )}
              {app.status === "accepted" && (
                <div className="mt-3">
                  {reviewFor === app.id ? (
                    <div className="space-y-2">
                      <Textarea value={body} onChange={(e) => setBody(e.target.value)} />
                      <Button
                        size="sm"
                        onClick={() => {
                          void addReview({
                            data: { listingId: app.listing_id, applicationId: app.id, rating: 5, body },
                          }).then(() => {
                            setReviewFor(null);
                            setBody("");
                          });
                        }}
                      >
                        {t(lang, "submitReview")}
                      </Button>
                    </div>
                  ) : (
                    <button type="button" className="text-sm text-primary" onClick={() => setReviewFor(app.id)}>
                      {t(lang, "writeReview")}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
