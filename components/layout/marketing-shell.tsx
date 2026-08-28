"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ROUTES } from "@/constants";
import { useAuthStore } from "@/store";
import { getRoleHome } from "@/lib/rbac";
import { buttonVariants } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { PlatformLogo } from "@/components/shared/platform-logo";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

export function MarketingHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();
  const { t } = useI18n();

  const NAV = [
    { href: ROUTES.PROJECTS, label: t("nav.projects") },
    { href: "/#how-it-works", label: t("nav.howItWorks") },
    { href: ROUTES.MEMBERSHIP, label: t("nav.serviceFee") },
    { href: ROUTES.ABOUT, label: t("nav.about") },
  ];

  const dashboardHref = getRoleHome(user?.role) || ROUTES.LOGIN;

  const isActive = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="container-wide section-pad flex h-16 items-center justify-between">
        <Link href={ROUTES.HOME} className="shrink-0">
          <PlatformLogo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive(item.href)
                  ? "text-foreground bg-secondary/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher compact />
          {isAuthenticated && user ? (
            <Link href={dashboardHref} className={cn(buttonVariants({ size: "sm" }))}>
              {t("common.dashboard")}
            </Link>
          ) : (
            <>
              <Link
                href={ROUTES.LOGIN}
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                {t("common.signIn")}
              </Link>
              <Link href={ROUTES.REGISTER} className={cn(buttonVariants({ size: "sm" }))}>
                {t("common.getStarted")}
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher compact />
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-foreground hover:bg-secondary"
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-card px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-0.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {isAuthenticated ? (
              <Link
                href={dashboardHref}
                className={cn(buttonVariants(), "w-full")}
                onClick={() => setOpen(false)}
              >
                {t("common.dashboard")}
              </Link>
            ) : (
              <>
                <Link
                  href={ROUTES.LOGIN}
                  className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                  onClick={() => setOpen(false)}
                >
                  {t("common.signIn")}
                </Link>
                <Link
                  href={ROUTES.REGISTER}
                  className={cn(buttonVariants(), "w-full")}
                  onClick={() => setOpen(false)}
                >
                  {t("common.getStarted")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-card">
      <div className="container-wide section-pad grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:py-16">
        <div className="sm:col-span-2 lg:col-span-1">
          <PlatformLogo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{t("footer.platform")}</p>
          <div className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link href={ROUTES.PROJECTS} className="transition hover:text-foreground">
              {t("nav.projects")}
            </Link>
            <Link href="/#how-it-works" className="transition hover:text-foreground">
              {t("nav.howItWorks")}
            </Link>
            <Link href={ROUTES.MEMBERSHIP} className="transition hover:text-foreground">
              {t("nav.serviceFee")}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{t("footer.investors")}</p>
          <div className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link href={ROUTES.PROJECTS} className="transition hover:text-foreground">
              {t("footer.viewProjects")}
            </Link>
            <Link href={ROUTES.INVESTOR_DASHBOARD} className="transition hover:text-foreground">
              {t("footer.investorDashboard")}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{t("footer.help")}</p>
          <div className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link href="/#faq" className="transition hover:text-foreground">
              {t("landing.faq")}
            </Link>
            <Link href={ROUTES.CONTACT} className="transition hover:text-foreground">
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("common.platformName")}. {t("footer.rights")}
      </div>
    </footer>
  );
}
