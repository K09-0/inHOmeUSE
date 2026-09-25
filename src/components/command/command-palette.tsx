import { useEffect, useMemo, useState } from "react";
import { Command } from "cmdk";
import { useNavigate } from "@tanstack/react-router";
import { t, useI18n } from "@/lib/i18n";
import type { Listing } from "@/lib/types";

export function CommandPalette({ listings }: { listings: Listing[] }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { lang, setLang } = useI18n();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const items = useMemo(() => listings.slice(0, 12), [listings]);
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-start bg-ink/35 p-4 pt-[12vh]" onClick={() => setOpen(false)}>
      <Command
        className="mx-auto w-full max-w-lg overflow-hidden rounded-[24px] bg-surface shadow-[var(--shadow-border)]"
        onClick={(e) => e.stopPropagation()}
      >
        <Command.Input
          autoFocus
          placeholder={t(lang, "commandHint")}
          className="h-14 w-full border-b border-line bg-transparent px-5 text-base outline-none"
        />
        <Command.List className="max-h-80 overflow-auto p-2">
          <Command.Empty className="px-3 py-6 text-sm text-muted">{t(lang, "commandEmpty")}</Command.Empty>
          <Command.Group>
            {items.map((listing) => (
              <Command.Item
                key={listing.id}
                value={`${listing.title} ${listing.city} ${listing.district}`}
                onSelect={() => {
                  setOpen(false);
                  void navigate({ to: "/listing/$id", params: { id: String(listing.id) } });
                }}
                className="flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm data-[selected=true]:bg-primary/8"
              >
                <span>{listing.title}</span>
                <span className="text-xs text-muted">{listing.city}</span>
              </Command.Item>
            ))}
            <Command.Item value="search" onSelect={() => { setOpen(false); void navigate({ to: "/search" }); }} className="rounded-xl px-3 py-2.5 text-sm data-[selected=true]:bg-primary/8">
              {t(lang, "search")}
            </Command.Item>
            <Command.Item value="kazakh" onSelect={() => setLang("kk")} className="rounded-xl px-3 py-2.5 text-sm data-[selected=true]:bg-primary/8">ҚАЗ</Command.Item>
            <Command.Item value="russian" onSelect={() => setLang("ru")} className="rounded-xl px-3 py-2.5 text-sm data-[selected=true]:bg-primary/8">РУС</Command.Item>
            <Command.Item value="english" onSelect={() => setLang("en")} className="rounded-xl px-3 py-2.5 text-sm data-[selected=true]:bg-primary/8">ENG</Command.Item>
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}

export function CommandTrigger({ onOpen }: { onOpen?: () => void }) {
  const { lang } = useI18n();
  return (
    <button
      type="button"
      onClick={onOpen}
      className="hidden h-10 items-center gap-2 rounded-full bg-fg/5 px-3 text-sm text-muted md:inline-flex"
    >
      {t(lang, "commandHint")}
      <kbd className="rounded-md bg-surface px-1.5 py-0.5 text-[10px] tracking-wide shadow-[var(--shadow-border)]">⌘K</kbd>
    </button>
  );
}
