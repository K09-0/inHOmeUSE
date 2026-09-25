import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { listConversations } from "@/lib/server/chats";
import type { Conversation } from "@/lib/types";
import { t, useI18n } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";

export const Route = createFileRoute("/chats")({ component: ChatsPage });

function ChatsPage() {
  const { lang } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [items, setItems] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!user) return;
    void listConversations().then(setItems).catch(() => setItems([]));
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
      <h1 className="font-display text-4xl tracking-tight">{t(lang, "chats")}</h1>
      <div className="mt-6 space-y-2">
        {items.length === 0 && <p className="text-sm text-muted">{t(lang, "emptyChats")}</p>}
        {items.map((c) => (
          <Link
            key={c.id}
            to="/chats/$id"
            params={{ id: String(c.id) }}
            className="flex items-center gap-3 rounded-2xl bg-surface p-3 shadow-[var(--shadow-border)]"
          >
            {c.listing_photo ? (
              <img src={c.listing_photo} alt="" className="size-14 rounded-xl object-cover" />
            ) : (
              <div className="size-14 rounded-xl bg-line" />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{c.listing_title}</p>
              <p className="truncate text-sm text-muted">{c.other_name} · {c.last_body}</p>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
