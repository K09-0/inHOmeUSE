import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { t, type Lang } from "@/lib/i18n";

export function KeySwipe({
  lang,
  disabled,
  onConfirm,
}: {
  lang: Lang;
  disabled?: boolean;
  onConfirm: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [done, setDone] = useState(false);

  function clientToProgress(clientX: number) {
    const el = trackRef.current;
    if (!el) return 0;
    const rect = el.getBoundingClientRect();
    const max = rect.width - 56;
    return Math.min(1, Math.max(0, (clientX - rect.left - 28) / max));
  }

  function finish(progress: number) {
    if (progress >= 0.9 && !done && !disabled) {
      setX(1);
      setDone(true);
      onConfirm();
      return;
    }
    setX(0);
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{t(lang, "swipeKey")}</p>
      <div
        ref={trackRef}
        className={cn(
          "key-track relative h-14 overflow-hidden rounded-full",
          disabled && "opacity-50",
        )}
        onPointerDown={(e) => {
          if (disabled || done) return;
          (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          setDragging(true);
          setX(clientToProgress(e.clientX));
        }}
        onPointerMove={(e) => {
          if (!dragging || disabled || done) return;
          setX(clientToProgress(e.clientX));
        }}
        onPointerUp={(e) => {
          if (!dragging) return;
          setDragging(false);
          finish(clientToProgress(e.clientX));
        }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-primary/20"
          style={{ width: `${Math.max(14, x * 100)}%` }}
        />
        <div
          className="absolute top-1 grid size-12 place-items-center rounded-full bg-primary text-primary-fg shadow-[0_8px_18px_-8px_rgb(227_6_19)] transition-transform duration-150"
          style={{ left: `calc(${x * 100}% - ${x * 48}px + 4px)` }}
        >
          <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
            <circle cx="9" cy="8" r="3.4" fill="currentColor" />
            <path d="M9 11.5V20h2.4l1.8-2 1.5 1.3 1-1.2-1.5-1.3 1.2-1.4-1-.9-3 3.2h-1V14H10.2v1.6H8.4v-4.1Z" fill="currentColor" />
          </svg>
        </div>
        <div className="absolute right-2 top-1 grid size-12 place-items-center rounded-full bg-ink text-paper">
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
            <path d="M8 11V8a4 4 0 1 1 8 0v3" fill="none" stroke="currentColor" strokeWidth="1.8" />
            <rect x="7" y="11" width="10" height="8" rx="2" fill="currentColor" />
          </svg>
        </div>
      </div>
    </div>
  );
}
