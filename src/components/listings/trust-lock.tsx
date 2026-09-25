import { useId } from "react";
import { cn } from "@/lib/utils";

export function TrustLock({
  score,
  verified,
  className,
}: {
  score: number;
  verified?: boolean;
  className?: string;
}) {
  const uid = useId();
  const pct = Math.max(8, Math.min(100, score));
  const filled = pct > 55;
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="relative grid size-8 place-items-center">
        <svg viewBox="0 0 32 32" className="size-8">
          <rect x="1" y="1" width="30" height="30" rx="9" fill="none" stroke="currentColor" className="text-line" strokeWidth="1.5" />
          <defs>
            <clipPath id={uid}>
              <rect x="0" y={32 - (32 * pct) / 100} width="32" height="32" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${uid})`}>
            <rect x="1" y="1" width="30" height="30" rx="9" fill="#E30613" />
          </g>
          <path
            d="M12 15.2V13a4 4 0 1 1 8 0v2.2"
            fill="none"
            stroke={filled ? "#FAF6F2" : "#E30613"}
            strokeWidth="1.7"
            strokeLinecap="round"
          />
          <rect x="11" y="15" width="10" height="8.5" rx="2" fill={filled ? "#FAF6F2" : "#E30613"} />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
          {verified ? "ID" : "lock"}
        </span>
        <span className="font-display text-sm tabular-nums">{score}</span>
      </span>
    </div>
  );
}
