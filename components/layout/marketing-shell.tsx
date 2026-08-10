"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { PLATFORM_NAME, ROUTES } from "@/constants";
import { useAuthStore } from "@/store";
import { getRoleHome } from "@/lib/rbac";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: ROUTES.PROJECTS || "/projects", label: "Projects" },
  { href: ROUTES.MEMBERSHIP || "/membership", label: "Membership" },
  { href: ROUTES.ABOUT || "/about", label: "About" },
  { href: ROUTES.CONTACT || "/contact", label: "Contact" },
] as const;

export function MarketingHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  const homeHref = ROUTES.HOME || "/";
  const loginHref = ROUTES.LOGIN || "/login";
  const registerHref = ROUTES.REGISTER || "/register";
  const dashboardHref = getRoleHome(user?.role) || "/login";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/80 backdrop-blur-xl">
      <div className="container-narrow section-pad flex h-16 items-center justify-between">
        <Link
          href={homeHref}
          className="font-display text-xl font-semibold tracking-tight text-slate-900"
        >
          {PLATFORM_NAME}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium text-slate-600 transition hover:text-slate-900",
                pathname === item.href && "text-slate-900"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated && user ? (
            <Link href={dashboardHref} className={cn(buttonVariants())}>
              Go to dashboard <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          ) : (
            <>
              <Link href={loginHref} className={cn(buttonVariants({ variant: "ghost" }))}>
                Sign in
              </Link>
              <Link href={registerHref} className={cn(buttonVariants())}>
                Get started
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
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
              {isAuthenticated ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  const homeRegisterInvestor = `${ROUTES.REGISTER || "/register"}?role=investor`;
  const homeRegisterOwner = `${ROUTES.REGISTER || "/register"}?role=project_owner`;

  return (
    <footer className="border-t border-border bg-white">
      <div className="container-narrow section-pad grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-semibold">{PLATFORM_NAME}</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            A secure investment marketplace connecting innovative project owners with verified
            investors.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Platform</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href={ROUTES.PROJECTS || "/projects"}>Projects</Link>
            <Link href={ROUTES.MEMBERSHIP || "/membership"}>Membership</Link>
            <Link href={ROUTES.ABOUT || "/about"}>About</Link>
            <Link href={ROUTES.CONTACT || "/contact"}>Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Accounts</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href={homeRegisterInvestor}>Investor signup</Link>
            <Link href={homeRegisterOwner}>Owner signup</Link>
            <Link href={ROUTES.LOGIN || "/login"}>Sign in</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {PLATFORM_NAME}. All rights reserved. Communication stays
        on-platform.
      </div>
    </footer>
  );
}
