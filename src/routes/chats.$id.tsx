import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getConversation, sendMessage } from "@/lib/server/chats";
import type { ChatMessage, Conversation } from "@/lib/types";
import { t, useI18n } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chats/$id")({ component: ChatThread });

function ChatThread() {
  const { id } = Route.useParams();
  const convId = Number(id);
  const { lang } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [body, setBody] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  async function load() {
    const data = await getConversation({ data: convId });
    if (!data) return;
    setConversation(data.conversation);
    setMessages(data.messages);
  }

  useEffect(() => {
    if (!user) return;
    void load();
    const tmr = window.setInterval(() => void load(), 4000);
    return () => window.clearInterval(tmr);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, convId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (isPending) {
    return (
      <AppShell>
        <p className="text-muted">{t(lang, "loading")}</p>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  async function onSend(e: FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    const text = body.trim();
    setBody("");
    await sendMessage({ data: { conversationId: convId, body: text } });
    await load();
  }

  return (
    <AppShell>
      <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col rounded-[28px] bg-surface shadow-[var(--shadow-border)]">
        <div className="border-b border-line px-5 py-4">
          <p className="font-display text-xl">{conversation?.listing_title}</p>
          <p className="text-sm text-muted">{conversation?.other_name}</p>
        </div>
        <div className="flex-1 space-y-2 overflow-auto px-4 py-4">
          {messages.map((m) => {
            const mine = m.sender_id === user.id;
            return (
              <div
                key={m.id}
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2 text-sm",
                  mine ? "ml-auto bg-primary text-primary-fg" : "bg-bg text-fg",
                )}
              >
                {m.body}
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <form className="flex gap-2 border-t border-line p-3" onSubmit={onSend}>
          <Input value={body} onChange={(e) => setBody(e.target.value)} placeholder={t(lang, "typeMessage")} />
          <Button type="submit">{t(lang, "send")}</Button>
        </form>
      </div>
    </AppShell>
  );
}
