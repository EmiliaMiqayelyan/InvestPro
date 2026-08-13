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

  // Keep public nav short and readable (esp. Armenian)
  const NAV = [
    { href: ROUTES.PROJECTS || "/projects", label: t("nav.projects") },
    { href: "/#how-it-works", label: t("nav.howItWorks") },
    { href: ROUTES.ABOUT || "/about", label: t("nav.about") },
  ];

  const homeHref = ROUTES.HOME || "/";
  const loginHref = ROUTES.LOGIN || "/login";
  const registerHref = ROUTES.REGISTER || "/register";
  const dashboardHref = getRoleHome(user?.role) || "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-[hsl(var(--card))]/95 backdrop-blur-md">
      <div className="container-narrow section-pad flex h-16 items-center justify-between gap-4">
        <Link href={homeHref} className="shrink-0">
          <PlatformLogo />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "whitespace-nowrap text-sm font-medium text-slate-600 transition hover:text-teal-900",
                pathname === item.href && "text-teal-900"
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
              {t("common.dashboard")} <ArrowRight className="ml-1 h-4 w-4" />
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
        <div className="border-t border-border bg-[hsl(var(--card))] px-4 py-4 lg:hidden">
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
              className="text-sm font-medium"
            >
              {isAuthenticated ? t("common.dashboard") : t("common.signIn")}
            </Link>
            {!isAuthenticated && (
              <Link
                href={registerHref}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-teal-800"
              >
                {t("common.getStarted")}
              </Link>
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
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-narrow section-pad grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
        <div className="sm:col-span-2 lg:col-span-1">
          <PlatformLogo />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
            {t("footer.tagline")}
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{t("footer.platform")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            <Link href={ROUTES.PROJECTS} className="hover:text-slate-900">
              {t("nav.projects")}
            </Link>
            <Link href="/#how-it-works" className="hover:text-slate-900">
              {t("nav.howItWorks")}
            </Link>
            <Link href={ROUTES.ABOUT} className="hover:text-slate-900">
              {t("nav.about")}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{t("footer.projectOwners")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            <Link href={`${ROUTES.REGISTER}?role=project_owner`} className="hover:text-slate-900">
              {t("footer.publishProject")}
            </Link>
            <Link href={ROUTES.OWNER_DASHBOARD} className="hover:text-slate-900">
              {t("footer.ownerDashboard")}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{t("footer.investors")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            <Link href={ROUTES.PROJECTS} className="hover:text-slate-900">
              {t("footer.viewProjects")}
            </Link>
            <Link href={ROUTES.INVESTOR_DASHBOARD} className="hover:text-slate-900">
              {t("footer.investorDashboard")}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{t("footer.help")}</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500">
            <Link href="/#faq" className="hover:text-slate-900">
              {t("landing.faq")}
            </Link>
            <Link href={ROUTES.CONTACT} className="hover:text-slate-900">
              {t("nav.contact")}
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {t("common.platformName")}. {t("footer.rights")}
      </div>
    </footer>
  );
}
