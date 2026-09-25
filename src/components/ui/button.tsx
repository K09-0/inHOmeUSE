import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "sm" | "md" | "lg" }
>(function Button({ className, variant = "primary", size = "md", ...props }, ref) {
  return (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-[transform,background-color,box-shadow,color] duration-150 ease-out",
        "active:not-disabled:scale-[0.96] disabled:opacity-50 disabled:cursor-not-allowed",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        size === "sm" && "h-9 rounded-[10px] px-3 text-sm",
        size === "md" && "h-11 rounded-xl px-4 text-sm",
        size === "lg" && "h-12 rounded-2xl px-5 text-base",
        variant === "primary" && "bg-primary text-primary-fg shadow-[0_8px_20px_-12px_rgb(227_6_19_/_0.8)] hover:brightness-110",
        variant === "secondary" && "bg-surface text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
        variant === "ghost" && "bg-transparent text-fg hover:bg-fg/5",
        variant === "danger" && "bg-primary/10 text-primary hover:bg-primary/15",
        className,
      )}
      {...props}
    />
  );
});
