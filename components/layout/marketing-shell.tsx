"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
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
    { href: ROUTES.PROJECTS || "/projects", label: t("nav.projects") },
    { href: "/#how-it-works", label: t("nav.howItWorks") },
    { href: `${ROUTES.REGISTER || "/register"}?role=investor`, label: t("nav.forInvestors") },
    {
      href: `${ROUTES.REGISTER || "/register"}?role=project_owner`,
      label: t("nav.forOwners"),
    },
    { href: ROUTES.ABOUT || "/about", label: t("nav.about") },
  ];

  const homeHref = ROUTES.HOME || "/";
  const loginHref = ROUTES.LOGIN || "/login";
  const registerHref = ROUTES.REGISTER || "/register";
  const dashboardHref = getRoleHome(user?.role) || "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/95 backdrop-blur-xl">
      <div className="container-narrow section-pad flex h-16 items-center justify-between gap-4">
        <Link href={homeHref} className="shrink-0">
          <PlatformLogo />
        </Link>

        <nav className="hidden items-center gap-5 xl:gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap text-sm font-medium text-slate-600 transition hover:text-slate-900",
                pathname === item.href && "text-slate-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 lg:flex lg:gap-3">
          <LanguageSwitcher compact />
          {isAuthenticated && user ? (
            <Link href={dashboardHref} className={cn(buttonVariants())}>
              {t("common.goToDashboard")} <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link href={loginHref} className={cn(buttonVariants({ variant: "ghost" }))}>
                {t("common.signIn")}
              </Link>
              <Link href={registerHref} className={cn(buttonVariants())}>
                {t("common.getStarted")}
              </Link>
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-2 lg:hidden">
          <LanguageSwitcher compact />
          <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={isAuthenticated ? dashboardHref : loginHref}
              onClick={() => setOpen(false)}
            >
              {isAuthenticated ? t("common.dashboard") : t("common.signIn")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  const { t } = useI18n();
  const homeRegisterInvestor = `${ROUTES.REGISTER || "/register"}?role=investor`;
  const homeRegisterOwner = `${ROUTES.REGISTER || "/register"}?role=project_owner`;

  return (
    <footer className="border-t border-border bg-white">
      <div className="container-narrow section-pad grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <PlatformLogo />
          <p className="mt-2 max-w-md text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        <div>
          <p className="text-sm font-semibold">{t("footer.platform")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href={ROUTES.PROJECTS || "/projects"}>{t("nav.projects")}</Link>
            <Link href={ROUTES.ABOUT || "/about"}>{t("nav.about")}</Link>
            <Link href={ROUTES.CONTACT || "/contact"}>{t("nav.contact")}</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">{t("footer.accounts")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href={homeRegisterInvestor}>{t("footer.investorSignup")}</Link>
            <Link href={homeRegisterOwner}>{t("footer.ownerSignup")}</Link>
            <Link href={ROUTES.LOGIN || "/login"}>{t("common.signIn")}</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {t("common.platformName")}. {t("footer.rights")}
      </div>
    </footer>
  );
}
