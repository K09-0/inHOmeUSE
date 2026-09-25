import { Link, useRouterState } from "@tanstack/react-router";
import { Heart, Home, KeyRound, MessageCircle, Search, UserRound } from "lucide-react";
import { Wordmark } from "@/components/brand/logo";
import { LanguageSwitcher } from "@/components/lang/language-switcher";
import { t, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";

const NAV = [
  { to: "/", key: "home" as const, icon: Home },
  { to: "/search", key: "search" as const, icon: Search },
  { to: "/chats", key: "chats" as const, icon: MessageCircle },
  { to: "/host", key: "host" as const, icon: KeyRound },
  { to: "/profile", key: "profile" as const, icon: UserRound },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const { lang } = useI18n();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();

  return (
    <div className="paper-grain min-h-dvh overflow-x-hidden bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-line/80 bg-bg/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl min-w-0 items-center justify-between gap-2 px-4">
          <Link to="/" className="min-w-0 shrink">
            <Wordmark compact />
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-medium transition-colors",
                  pathname === item.to ? "bg-primary text-primary-fg" : "text-muted hover:text-fg",
                )}
              >
                {t(lang, item.key)}
              </Link>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1">
            <Link to="/favorites" className="grid size-11 place-items-center rounded-full hover:bg-fg/5" aria-label={t(lang, "favorites")}>
              <Heart className="size-5" />
            </Link>
            <div className="hidden sm:block">
              <LanguageSwitcher />
            </div>
            {isPending ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-fg/10" />
            ) : user ? (
              <UserButton />
            ) : (
              <Link to="/login" className="rounded-full bg-primary px-3 py-2 text-sm font-medium text-primary-fg">
                {t(lang, "signIn")}
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 md:pb-12">{children}</main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-md md:hidden">
        <div className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 text-[11px]",
                  active ? "text-primary" : "text-muted",
                )}
              >
                <Icon className="size-5" />
                {t(lang, item.key)}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
