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
  Milestone,
  ExternalLink,
  X,
  Wallet,
  PieChart,
  Building2,
  Lock,
} from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/constants";
import { useAuth, useI18n } from "@/hooks";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { PlatformLogo } from "@/components/shared/platform-logo";
import { NotificationCenter } from "@/components/workspace/notification-center";
import { PageTitleProvider, usePageTitle } from "@/components/providers/page-title-provider";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";
import type { TranslationKey } from "@/i18n";

type NavItem = {
  href: string;
  labelKey: TranslationKey;
  icon: React.ComponentType<{ className?: string }>;
};

type NavGroup = {
  labelKey: TranslationKey;
  items: NavItem[];
};

const INVESTOR_NAV: NavGroup[] = [
  {
    labelKey: "nav.groupOverview",
    items: [{ href: ROUTES.INVESTOR_DASHBOARD, labelKey: "nav.home", icon: LayoutDashboard }],
  },
  {
    labelKey: "nav.groupDiscover",
    items: [
      { href: ROUTES.INVESTOR_PROJECTS, labelKey: "nav.projects", icon: Briefcase },
      { href: ROUTES.INVESTOR_SAVED, labelKey: "nav.saved", icon: Bookmark },
    ],
  },
  {
    labelKey: "nav.groupEngage",
    items: [
      { href: ROUTES.INVESTOR_INVESTMENTS, labelKey: "nav.myInvestments", icon: Handshake },
      { href: ROUTES.INVESTOR_PORTFOLIO, labelKey: "nav.portfolio", icon: PieChart },
      { href: ROUTES.INVESTOR_WALLET, labelKey: "nav.wallet", icon: Wallet },
      { href: ROUTES.INVESTOR_MILESTONES, labelKey: "nav.milestones", icon: Milestone },
      { href: ROUTES.INVESTOR_MESSAGES, labelKey: "nav.messages", icon: MessageSquare },
    ],
  },
  {
    labelKey: "nav.groupAccount",
    items: [
      { href: ROUTES.INVESTOR_MEMBERSHIP, labelKey: "nav.serviceFee", icon: CreditCard },
      { href: ROUTES.INVESTOR_KYC, labelKey: "nav.verification", icon: Shield },
      { href: ROUTES.INVESTOR_SECURITY, labelKey: "nav.security", icon: Lock },
      { href: ROUTES.INVESTOR_PROFILE, labelKey: "nav.profile", icon: UserCircle },
    ],
  },
];

const OWNER_NAV: NavGroup[] = [
  {
    labelKey: "nav.groupOverview",
    items: [{ href: ROUTES.OWNER_DASHBOARD, labelKey: "nav.home", icon: LayoutDashboard }],
  },
  {
    labelKey: "nav.groupProjects",
    items: [
      { href: ROUTES.OWNER_PROJECTS, labelKey: "nav.myProjects", icon: FolderKanban },
      { href: ROUTES.OWNER_PROJECT_CREATE, labelKey: "nav.createProject", icon: FileText },
      { href: ROUTES.OWNER_DOCUMENTS, labelKey: "nav.documents", icon: FileText },
      { href: ROUTES.OWNER_TEAM, labelKey: "nav.team", icon: Users },
    ],
  },
  {
    labelKey: "nav.groupEngage",
    items: [
      { href: ROUTES.OWNER_OFFERS, labelKey: "nav.investorRequests", icon: Handshake },
      { href: ROUTES.OWNER_MILESTONES, labelKey: "nav.milestones", icon: Milestone },
      { href: ROUTES.OWNER_MESSAGES, labelKey: "nav.messages", icon: MessageSquare },
    ],
  },
  {
    labelKey: "nav.groupAccount",
    items: [
      { href: ROUTES.OWNER_ANALYTICS, labelKey: "nav.analytics", icon: BarChart3 },
      { href: ROUTES.OWNER_KYB, labelKey: "nav.companyVerification", icon: Building2 },
      { href: ROUTES.OWNER_PROFILE, labelKey: "nav.profile", icon: UserCircle },
    ],
  },
];

const ADMIN_NAV: NavGroup[] = [
  {
    labelKey: "nav.groupOverview",
    items: [{ href: ROUTES.ADMIN_DASHBOARD, labelKey: "nav.home", icon: LayoutDashboard }],
  },
  {
    labelKey: "nav.groupManage",
    items: [
      { href: ROUTES.ADMIN_USERS, labelKey: "nav.users", icon: Users },
      { href: ROUTES.ADMIN_PROJECTS, labelKey: "nav.projects", icon: FolderKanban },
      { href: ROUTES.ADMIN_PAYMENTS, labelKey: "nav.payments", icon: CreditCard },
      { href: ROUTES.ADMIN_MEMBERSHIPS, labelKey: "nav.memberships", icon: CreditCard },
    ],
  },
  {
    labelKey: "nav.groupSystem",
    items: [
      { href: ROUTES.ADMIN_SECURITY, labelKey: "nav.security", icon: Shield },
      { href: ROUTES.ADMIN_COMPLAINTS, labelKey: "nav.complaints", icon: AlertTriangle },
      { href: ROUTES.ADMIN_DISPUTES, labelKey: "nav.disputes", icon: AlertTriangle },
      { href: ROUTES.ADMIN_SETTINGS, labelKey: "nav.settings", icon: Settings },
    ],
  },
];

function navForRole(role: UserRole | undefined): NavGroup[] {
  if (role === "admin") return ADMIN_NAV;
  if (role === "project_owner") return OWNER_NAV;
  return INVESTOR_NAV;
}

function WorkspaceShellInner({
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
  const { pageTitle } = usePageTitle();
  const [open, setOpen] = useState(false);
  const navGroups = navForRole(user?.role);

  const roleLabel =
    user?.role === "admin"
      ? t("roles.admin")
      : user?.role === "project_owner"
        ? t("roles.project_owner")
        : t("roles.investor");

  const displayTitle = pageTitle.title || title || t("common.dashboard");
  const initials = `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase();

  const onLogout = () => {
    logout();
    router.push(ROUTES.LOGIN);
  };

  const SidebarContent = (
    <>
      <div className="flex h-16 items-center border-b border-sidebar-border px-4">
        <Link href={ROUTES.HOME}>
          <PlatformLogo size="sm" theme="dark" />
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {navGroups.map((group) => (
          <div key={group.labelKey}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted">
              {t(group.labelKey)}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active
                        ? "bg-white/10 text-white"
                        : "text-sidebar-muted hover:bg-white/5 hover:text-sidebar-foreground"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0",
                        active ? "text-sidebar-accent" : "opacity-70"
                      )}
                    />
                    <span className="truncate">{t(item.labelKey)}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <Link
          href={ROUTES.PROJECTS}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-sidebar-muted transition hover:bg-white/5 hover:text-sidebar-foreground"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          {t("nav.browseMarketplace")}
        </Link>
      </div>

      <div className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            {initials || "?"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-sidebar-muted">{roleLabel}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-sidebar-muted transition hover:bg-white/5 hover:text-sidebar-foreground"
        >
          <LogOut className="h-4 w-4" />
          {t("common.signOut")}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-secondary/30">
      <aside className="sidebar-surface hidden h-full w-[252px] shrink-0 flex-col lg:flex">
        {SidebarContent}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="sidebar-surface relative z-10 flex h-full w-[280px] flex-col shadow-xl">
            <button
              className="absolute right-3 top-4 rounded-lg p-1.5 text-sidebar-muted hover:bg-white/10 hover:text-white"
              onClick={() => setOpen(false)}
              aria-label={t("common.close")}
            >
              <X className="h-5 w-5" />
            </button>
            {SidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <header className="z-40 shrink-0 border-b border-border bg-card/95 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                className="rounded-lg p-2 hover:bg-secondary lg:hidden"
                onClick={() => setOpen(true)}
                aria-label={t("common.open")}
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-display text-lg font-semibold">{displayTitle}</h1>
                {pageTitle.breadcrumbs.length > 0 && (
                  <p className="truncate text-xs text-muted-foreground">
                    {pageTitle.breadcrumbs.map((b) => b.label).join(" / ")}
                  </p>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <NotificationCenter />
              <LanguageSwitcher compact />
            </div>
          </div>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export function WorkspaceShell({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <PageTitleProvider>
      <WorkspaceShellInner title={title}>{children}</WorkspaceShellInner>
    </PageTitleProvider>
  );
}
