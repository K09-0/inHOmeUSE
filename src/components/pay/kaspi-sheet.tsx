import { Button } from "@/components/ui/button";
import { t, type Lang } from "@/lib/i18n";
import { formatKzt } from "@/lib/utils";

export function KaspiSheet({
  lang,
  amount,
  reference,
  open,
  busy,
  onClose,
  onConfirm,
}: {
  lang: Lang;
  amount: number;
  reference: string;
  open: boolean;
  busy?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-ink/40 p-3 sm:place-items-center">
      <div className="w-full max-w-md rounded-[28px] bg-surface p-5 shadow-[var(--shadow-border)]">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl tracking-tight">{t(lang, "kaspiTitle")}</h2>
          <button type="button" onClick={onClose} className="text-sm text-muted">
            {t(lang, "close")}
          </button>
        </div>
        <p className="mt-2 text-sm text-muted">{t(lang, "kaspiHint")}</p>
        <div className="mt-5 grid place-items-center rounded-2xl bg-[#f3e9c9] p-6">
          <svg viewBox="0 0 120 120" className="size-40">
            <rect width="120" height="120" fill="#f3e9c9" />
            {Array.from({ length: 10 }).map((_, r) =>
              Array.from({ length: 10 }).map((__, c) => {
                const on = (r * 7 + c * 3 + reference.length) % 3 !== 0;
                if (!on) return null;
                return <rect key={`${r}-${c}`} x={8 + c * 10.4} y={8 + r * 10.4} width="8" height="8" fill="#1a1214" />;
              }),
            )}
          </svg>
          <p className="mt-2 font-display text-xl tabular-nums text-ink">{formatKzt(amount)}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-muted">{reference}</p>
        </div>
        <Button className="mt-5 w-full" disabled={busy} onClick={onConfirm}>
          {t(lang, "iPaid")}
        </Button>
      </div>
    </div>
  );
}
