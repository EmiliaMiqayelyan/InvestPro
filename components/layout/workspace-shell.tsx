"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  MessageSquare,
  FileText,
  Handshake,
  BarChart3,
  Users,
  UserCircle,
  LogOut,
  Briefcase,
  Bookmark,
  Shield,
  CreditCard,
  Settings,
  AlertTriangle,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/constants";
import { useAuth, useI18n } from "@/hooks";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { PlatformLogo } from "@/components/shared/platform-logo";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import type { TranslationKey } from "@/i18n";

type NavItem = {
  href: string;
  labelKey: TranslationKey;
  icon: React.ComponentType<{ className?: string }>;
};

const INVESTOR_NAV: NavItem[] = [
  { href: ROUTES.INVESTOR_DASHBOARD, labelKey: "common.dashboard", icon: LayoutDashboard },
  { href: ROUTES.PROJECTS, labelKey: "nav.marketplace", icon: Briefcase },
  { href: ROUTES.INVESTOR_INVESTMENTS, labelKey: "nav.myInvestments", icon: Handshake },
  { href: ROUTES.INVESTOR_SAVED, labelKey: "nav.saved", icon: Bookmark },
  { href: ROUTES.INVESTOR_MESSAGES, labelKey: "nav.messages", icon: MessageSquare },
  { href: ROUTES.INVESTOR_KYC, labelKey: "nav.verification", icon: Shield },
  { href: ROUTES.INVESTOR_PROFILE, labelKey: "nav.profile", icon: UserCircle },
];

const OWNER_NAV: NavItem[] = [
  { href: ROUTES.OWNER_DASHBOARD, labelKey: "common.dashboard", icon: LayoutDashboard },
  { href: ROUTES.OWNER_PROJECTS, labelKey: "nav.myProjects", icon: FolderKanban },
  { href: ROUTES.OWNER_PROJECT_CREATE, labelKey: "nav.createProject", icon: FileText },
  { href: ROUTES.OWNER_OFFERS, labelKey: "nav.investorRequests", icon: Handshake },
  { href: ROUTES.OWNER_MESSAGES, labelKey: "nav.messages", icon: MessageSquare },
  { href: ROUTES.OWNER_DOCUMENTS, labelKey: "nav.documents", icon: FileText },
  { href: ROUTES.OWNER_ANALYTICS, labelKey: "nav.analytics", icon: BarChart3 },
  { href: ROUTES.OWNER_TEAM, labelKey: "nav.team", icon: Users },
  { href: ROUTES.OWNER_PROFILE, labelKey: "nav.profile", icon: UserCircle },
];

const ADMIN_NAV: NavItem[] = [
  { href: ROUTES.ADMIN_DASHBOARD, labelKey: "common.dashboard", icon: LayoutDashboard },
  { href: ROUTES.ADMIN_USERS, labelKey: "nav.users", icon: Users },
  { href: ROUTES.ADMIN_PROJECTS, labelKey: "nav.projects", icon: FolderKanban },
  { href: ROUTES.ADMIN_PAYMENTS, labelKey: "nav.payments", icon: CreditCard },
  { href: ROUTES.ADMIN_SECURITY, labelKey: "nav.security", icon: Shield },
  { href: ROUTES.ADMIN_COMPLAINTS, labelKey: "nav.complaints", icon: AlertTriangle },
  { href: ROUTES.ADMIN_SETTINGS, labelKey: "nav.settings", icon: Settings },
];

function navForRole(role: UserRole | undefined): NavItem[] {
  if (role === "admin") return ADMIN_NAV;
  if (role === "project_owner") return OWNER_NAV;
  return INVESTOR_NAV;
}

export function WorkspaceShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const nav = navForRole(user?.role);

  const roleLabel =
    user?.role === "admin"
      ? t("roles.admin")
      : user?.role === "project_owner"
        ? t("roles.project_owner")
        : t("roles.investor");

  const onLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const Sidebar = (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-white">
      <div className="flex h-16 items-center justify-between border-b border-border px-5">
        <Link href={ROUTES.HOME}>
          <PlatformLogo size="sm" />
        </Link>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.labelKey)}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-4">
        <p className="truncate text-sm font-medium text-slate-900">
          {user?.firstName} {user?.lastName}
        </p>
        <p className="truncate text-xs text-muted-foreground">
          {roleLabel}
        </p>
        <Button variant="ghost" size="sm" className="mt-3 w-full justify-start gap-2" onClick={onLogout}>
          <LogOut className="h-4 w-4" /> {t("common.signOut")}
        </Button>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#f7f9fc]">
      <div className="hidden lg:block">{Sidebar}</div>
      {open && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setOpen(false)} />
          <div className="relative z-10 h-full">{Sidebar}</div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-white/90 px-4 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-semibold text-slate-900">
              {title || t("common.dashboard")}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <div className="hidden text-sm text-muted-foreground sm:block">{user?.email}</div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
