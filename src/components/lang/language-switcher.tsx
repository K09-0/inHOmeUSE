import { LANGS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { lang, setLang } = useI18n();
  return (
    <div className={cn("inline-flex rounded-full bg-fg/5 p-1", className)}>
      {LANGS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => setLang(item.id)}
          className={cn(
            "h-8 min-w-11 rounded-full px-2.5 text-[11px] font-semibold tracking-[0.12em] transition-colors",
            lang === item.id ? "bg-primary text-primary-fg" : "text-muted",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
