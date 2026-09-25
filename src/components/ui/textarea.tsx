import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(
          "min-h-28 w-full rounded-xl bg-surface px-3.5 py-3 text-sm text-fg shadow-[var(--shadow-border)]",
          "placeholder:text-muted/80 outline-none transition-[box-shadow] duration-150",
          "focus:shadow-[0_0_0_2px_rgb(227_6_19_/_0.28)]",
          className,
        )}
        {...props}
      />
    );
  },
);
