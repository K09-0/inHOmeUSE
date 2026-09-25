import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { Wordmark } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/lang/language-switcher";
import { t, useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { lang } = useI18n();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (mode === "up") {
        const { error: err } = await authClient.signUp.email({ email, password, name: name || "Guest" });
        if (err) throw new Error(err.message);
      } else {
        const { error: err } = await authClient.signIn.email({ email, password });
        if (err) throw new Error(err.message);
      }
      window.location.href = "/";
    } catch (err) {
      setError(err instanceof Error ? err.message : t(lang, "errorGeneric"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="paper-grain grid min-h-dvh place-items-center px-4 py-10">
      <div className="w-full max-w-md rounded-[28px] bg-surface p-6 shadow-[var(--shadow-border)] sm:p-8">
        <div className="flex items-start justify-between gap-3">
          <Link to="/">
            <Wordmark />
          </Link>
          <LanguageSwitcher />
        </div>
        <h1 className="mt-6 font-display text-3xl tracking-tight">{t(lang, "createAccount")}</h1>
        <p className="mt-2 text-sm text-muted">{t(lang, "onlineOnly")}</p>

        {authEnabled ? (
          <div className="mt-6 space-y-3">
            {GROK_PROVIDERS.map((p) => (
              <Button
                key={p.providerId}
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
              >
                {p.providerId.includes("google") ? t(lang, "continueGoogle") : t(lang, "continueX")}
              </Button>
            ))}
            <p className="pt-2 text-center text-xs uppercase tracking-[0.18em] text-muted">{t(lang, "orEmail")}</p>
            <form className="space-y-3" onSubmit={onEmail}>
              {mode === "up" && (
                <div>
                  <Label>{t(lang, "name")}</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
              )}
              <div>
                <Label>{t(lang, "email")}</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label>{t(lang, "password")}</Label>
                <Input
                  type="password"
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder={t(lang, "passwordHint")}
                />
              </div>
              {error && <p className="text-sm text-primary">{error}</p>}
              <Button type="submit" className="w-full" disabled={busy}>
                {mode === "up" ? t(lang, "signUp") : t(lang, "signIn")}
              </Button>
            </form>
            <button
              type="button"
              className="w-full text-sm text-muted underline-offset-4 hover:underline"
              onClick={() => setMode(mode === "up" ? "in" : "up")}
            >
              {mode === "up" ? t(lang, "welcomeBack") : t(lang, "signUp")}
            </button>
          </div>
        ) : (
          <p className="mt-6 text-sm text-muted">Sign-in is disabled.</p>
        )}
      </div>
    </main>
  );
}
