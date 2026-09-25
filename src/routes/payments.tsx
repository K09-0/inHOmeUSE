import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { KaspiSheet } from "@/components/pay/kaspi-sheet";
import { confirmKaspiPayment, listMyPayments } from "@/lib/server/payments";
import type { Payment } from "@/lib/types";
import { t, useI18n } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { formatKzt } from "@/lib/utils";

export const Route = createFileRoute("/payments")({ component: PaymentsPage });

function PaymentsPage() {
  const { lang } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [items, setItems] = useState<Payment[]>([]);
  const [active, setActive] = useState<Payment | null>(null);
  const [busy, setBusy] = useState(false);
  const [lockCode, setLockCode] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void listMyPayments().then(setItems).catch(() => setItems([]));
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
      <h1 className="font-display text-4xl tracking-tight">{t(lang, "payments")}</h1>
      <p className="mt-2 max-w-xl text-sm text-muted">{t(lang, "kaspiHint")}</p>
      {lockCode && (
        <div className="mt-4 rounded-2xl bg-ink px-4 py-3 text-paper">
          <p className="text-xs uppercase tracking-[0.16em] text-paper/60">{t(lang, "lockCode")}</p>
          <p className="font-display text-3xl tabular-nums tracking-[0.2em]">{lockCode}</p>
        </div>
      )}
      <div className="mt-6 space-y-3">
        {items.length === 0 && <p className="text-sm text-muted">{t(lang, "emptyApps")}</p>}
        {items.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <div>
              <p className="font-medium">{p.listing_title ?? p.kind}</p>
              <p className="text-sm text-muted">
                {formatKzt(p.amount_kzt)} · {p.method} · {p.status} · {p.kaspi_ref}
              </p>
            </div>
            {p.status === "pending" && p.payer_id === user.id && (
              <Button size="sm" onClick={() => setActive(p)}>
                {t(lang, "payKaspi")}
              </Button>
            )}
          </div>
        ))}
      </div>
      <KaspiSheet
        lang={lang}
        open={Boolean(active)}
        amount={active?.amount_kzt ?? 0}
        reference={active?.kaspi_ref ?? ""}
        busy={busy}
        onClose={() => setActive(null)}
        onConfirm={() => {
          if (!active) return;
          setBusy(true);
          void confirmKaspiPayment({ data: active.id })
            .then((res) => {
              setLockCode(res.lockCode ?? null);
              setItems((prev) => prev.map((x) => (x.id === active.id ? { ...x, status: "paid" } : x)));
              setActive(null);
            })
            .finally(() => setBusy(false));
        }}
      />
    </AppShell>
  );
}
