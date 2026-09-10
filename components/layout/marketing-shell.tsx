"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { ROUTES, SUPPORT_EMAIL } from "@/constants";
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
    { href: ROUTES.FOR_INVESTORS, label: t("nav.forInvestors") },
    { href: ROUTES.FOR_OWNERS, label: t("nav.forOwners") },
    { href: ROUTES.HOW_IT_WORKS, label: t("nav.howItWorks") },
    { href: ROUTES.ABOUT, label: t("nav.about") },
  ];

  const dashboardHref = getRoleHome(user?.role) || ROUTES.LOGIN;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const authLinks = isAuthenticated && user ? (
    <Link href={dashboardHref} className={cn(buttonVariants({ size: "sm" }))}>
      {t("common.dashboard")}
    </Link>
  ) : (
    <>
      <Link
        href={ROUTES.LOGIN}
        className={cn(
          buttonVariants({ variant: "outline", size: "sm" }),
          "border-border bg-transparent whitespace-nowrap"
        )}
      >
        {t("common.signIn")}
      </Link>
      <Link
        href={ROUTES.REGISTER}
        className={cn(buttonVariants({ size: "sm" }), "whitespace-nowrap")}
      >
        {t("common.register")}
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="container-header section-pad flex h-16 items-center justify-between gap-8 xl:gap-10">
        <Link href={ROUTES.HOME} className="shrink-0">
          <PlatformLogo />
        </Link>

        <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-2.5 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isActive(item.href)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <LanguageSwitcher compact />
          {authLinks}
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <LanguageSwitcher compact />
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-foreground hover:bg-secondary"
            aria-label={t("common.menu")}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Compact / tablet nav row */}
      <nav className="hidden border-t border-border/50 xl:hidden lg:block">
        <div className="container-header section-pad flex gap-1 overflow-x-auto py-2.5 scrollbar-none">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1.5 text-sm font-medium whitespace-nowrap",
                isActive(item.href)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-card px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-0.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary",
                  isActive(item.href) ? "bg-secondary text-foreground" : "text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            {isAuthenticated && user ? (
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
                  {t("common.register")}
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
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground sm:max-w-md">
            {t("footer.tagline")}
          </p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="mt-3 inline-block text-sm text-muted-foreground transition hover:text-foreground"
          >
            {SUPPORT_EMAIL}
          </a>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{t("footer.platform")}</p>
          <div className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link href={ROUTES.PROJECTS} className="transition hover:text-foreground">
              {t("nav.projects")}
            </Link>
            <Link href={ROUTES.HOW_IT_WORKS} className="transition hover:text-foreground">
              {t("nav.howItWorks")}
            </Link>
            <Link href={ROUTES.ABOUT} className="transition hover:text-foreground">
              {t("nav.about")}
            </Link>
            <Link href={ROUTES.MEMBERSHIP} className="transition hover:text-foreground">
              {t("nav.serviceFee")}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{t("footer.accounts")}</p>
          <div className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link href={ROUTES.FOR_INVESTORS} className="transition hover:text-foreground">
              {t("nav.forInvestors")}
            </Link>
            <Link href={ROUTES.FOR_OWNERS} className="transition hover:text-foreground">
              {t("nav.forOwners")}
            </Link>
            <Link href={`${ROUTES.REGISTER}?role=investor`} className="transition hover:text-foreground">
              {t("footer.investorSignup")}
            </Link>
            <Link
              href={`${ROUTES.REGISTER}?role=project_owner`}
              className="transition hover:text-foreground"
            >
              {t("footer.ownerSignup")}
            </Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">{t("footer.help")}</p>
          <div className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
            <Link href={ROUTES.FAQ} className="transition hover:text-foreground">
              {t("nav.faq")}
            </Link>
            <Link href={ROUTES.CONTACT} className="transition hover:text-foreground">
              {t("nav.contact")}
            </Link>
            <Link href={ROUTES.PRIVACY} className="transition hover:text-foreground">
              {t("nav.privacy")}
            </Link>
            <Link href={ROUTES.TERMS} className="transition hover:text-foreground">
              {t("nav.terms")}
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
