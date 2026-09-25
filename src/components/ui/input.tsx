import { type InputHTMLAttributes, type LabelHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "h-11 w-full rounded-xl bg-surface px-3.5 text-sm text-fg shadow-[var(--shadow-border)]",
          "placeholder:text-muted/80 outline-none transition-[box-shadow] duration-150",
          "focus:shadow-[0_0_0_2px_rgb(227_6_19_/_0.28)]",
          className,
        )}
        {...props}
      />
    );
  },
);

export function Label({ className, ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-muted", className)}
      {...props}
    />
  );
}
