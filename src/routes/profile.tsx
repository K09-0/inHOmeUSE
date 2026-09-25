import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TrustLock } from "@/components/listings/trust-lock";
import { LanguageSwitcher } from "@/components/lang/language-switcher";
import { getMyProfile, updateMyProfile, verifyMyProfile } from "@/lib/server/profiles";
import type { Profile } from "@/lib/types";
import { t, useI18n } from "@/lib/i18n";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { RedirectToSignIn } from "@/lib/auth/gates";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

function ProfilePage() {
  const { lang } = useI18n();
  const { user, isPending } = useCurrentUserState();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    void getMyProfile().then((p) => {
      setProfile(p);
      if (p.display_name === "Guest" && user.displayName) {
        void updateMyProfile({
          data: {
            display_name: user.displayName,
            role: p.role,
            phone: p.phone,
            bio: p.bio,
            city: p.city,
            language: lang,
          },
        }).then(setProfile);
      }
    });
  }, [user, lang]);

  if (isPending) {
    return (
      <AppShell>
        <p className="text-muted">{t(lang, "loading")}</p>
      </AppShell>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (!profile) {
    return (
      <AppShell>
        <p className="text-muted">{t(lang, "loading")}</p>
      </AppShell>
    );
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setBusy(true);
    try {
      const next = await updateMyProfile({
        data: {
          display_name: profile.display_name,
          role: profile.role,
          phone: profile.phone,
          bio: profile.bio,
          city: profile.city,
          language: lang,
        },
      });
      setProfile(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight">{t(lang, "profile")}</h1>
          <p className="mt-1 text-sm text-muted">{user.primaryEmail}</p>
        </div>
        <TrustLock score={profile.trust_score} verified={profile.verified} />
      </div>
      <div className="mt-4 sm:hidden">
        <LanguageSwitcher />
      </div>
      <form className="mt-8 grid max-w-xl gap-4" onSubmit={onSave}>
        <div>
          <Label>{t(lang, "name")}</Label>
          <Input
            value={profile.display_name}
            onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
          />
        </div>
        <div>
          <Label>{t(lang, "role")}</Label>
          <select
            className="h-11 w-full rounded-xl bg-surface px-3 shadow-[var(--shadow-border)]"
            value={profile.role}
            onChange={(e) => setProfile({ ...profile, role: e.target.value as Profile["role"] })}
          >
            <option value="renter">{t(lang, "renter")}</option>
            <option value="landlord">{t(lang, "landlord")}</option>
          </select>
        </div>
        <div>
          <Label>{t(lang, "phone")}</Label>
          <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
        </div>
        <div>
          <Label>{t(lang, "city")}</Label>
          <select
            className="h-11 w-full rounded-xl bg-surface px-3 shadow-[var(--shadow-border)]"
            value={profile.city}
            onChange={(e) => setProfile({ ...profile, city: e.target.value })}
          >
            <option value="Almaty">Almaty</option>
            <option value="Astana">Astana</option>
            <option value="Shymkent">Shymkent</option>
          </select>
        </div>
        <div>
          <Label>{t(lang, "bio")}</Label>
          <Textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
        </div>
        <Button type="submit" disabled={busy}>{t(lang, "save")}</Button>
      </form>
      <div className="mt-6 flex flex-wrap gap-3">
        {!profile.verified && (
          <Button
            variant="secondary"
            onClick={() => void verifyMyProfile().then(setProfile)}
          >
            {t(lang, "verify")}
          </Button>
        )}
        {profile.verified && <p className="text-sm text-success">{t(lang, "verifiedDone")}</p>}
        <Link to="/applications" className="text-sm text-primary">{t(lang, "applications")}</Link>
        <Link to="/payments" className="text-sm text-primary">{t(lang, "payments")}</Link>
        <Link to="/favorites" className="text-sm text-primary">{t(lang, "favorites")}</Link>
      </div>
    </AppShell>
  );
}
