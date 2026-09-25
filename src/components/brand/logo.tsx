import { cn } from "@/lib/utils";

export function KeyMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("shrink-0", className)} aria-hidden="true">
      <rect width="40" height="40" rx="12" fill="#E30613" />
      <path
        fill="#FAF6F2"
        d="M18.2 8.2a6.4 6.4 0 1 1-2.2 12.4l-.6.6v3.2h-2.4v2.2h2.4v2.2H13v2.4h8.6l3.4-3.6 2.6 2.2 1.7-2-2.7-2.3 2.2-2.4-1.8-1.7-5.2 5.6h-1.2v-2.2h2.4v-2.2h-2.4v-2.4l1.1-1.1a6.4 6.4 0 0 1-1.5-10.1Zm.2 3.4a3 3 0 1 0-3 3 3 3 0 0 0 3-3Z"
      />
    </svg>
  );
}

export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-fg", className)}>
      <KeyMark className={compact ? "size-7" : "size-8"} />
      <span className="font-display text-[1.15rem] leading-none tracking-[-0.04em] sm:text-[1.35rem]">
        in<span className="font-semibold">HOME</span>
        <span className="text-primary">use</span>
      </span>
    </span>
  );
}
