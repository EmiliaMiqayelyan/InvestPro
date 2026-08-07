"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { PLATFORM_NAME, ROUTES } from "@/constants";
import { useAuthStore } from "@/store";
import { getRoleHome } from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { href: ROUTES.PROJECTS, label: "Projects" },
  { href: ROUTES.MEMBERSHIP, label: "Membership" },
  { href: ROUTES.ABOUT, label: "About" },
  { href: ROUTES.CONTACT, label: "Contact" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-white/80 backdrop-blur-xl">
      <div className="container-narrow section-pad flex h-16 items-center justify-between">
        <Link href={ROUTES.HOME} className="font-display text-xl font-semibold tracking-tight text-slate-900">
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
            <Button asChild>
              <Link href={getRoleHome(user.role)}>
                Go to dashboard <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href={ROUTES.LOGIN}>Sign in</Link>
              </Button>
              <Button asChild>
                <Link href={ROUTES.REGISTER}>Get started</Link>
              </Button>
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
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="text-sm font-medium">
                {item.label}
              </Link>
            ))}
            <Link href={isAuthenticated ? getRoleHome(user?.role) : ROUTES.LOGIN} onClick={() => setOpen(false)}>
              {isAuthenticated ? "Dashboard" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="container-narrow section-pad grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-semibold">{PLATFORM_NAME}</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            A secure investment marketplace connecting innovative project owners with verified investors.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Platform</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href={ROUTES.PROJECTS}>Projects</Link>
            <Link href={ROUTES.MEMBERSHIP}>Membership</Link>
            <Link href={ROUTES.ABOUT}>About</Link>
            <Link href={ROUTES.CONTACT}>Contact</Link>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Accounts</p>
          <div className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href={`${ROUTES.REGISTER}?role=investor`}>Investor signup</Link>
            <Link href={`${ROUTES.REGISTER}?role=project_owner`}>Owner signup</Link>
            <Link href={ROUTES.LOGIN}>Sign in</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {PLATFORM_NAME}. All rights reserved. Communication stays on-platform.
      </div>
    </footer>
  );
}
