"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ArrowLeftRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  FileCheck,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks";
import { useUIStore } from "@/store";
import { Button } from "@/components/ui/button";

const adminNav = [
  { href: ROUTES.ADMIN, label: "Overview", icon: LayoutDashboard },
  { href: ROUTES.ADMIN_USERS, label: "Users", icon: Users },
  { href: ROUTES.ADMIN_KYC, label: "KYC", icon: FileCheck },
  { href: ROUTES.ADMIN_PROJECTS, label: "Projects", icon: FolderKanban },
  { href: ROUTES.ADMIN_DEPOSITS, label: "Deposits", icon: ArrowDownToLine },
  { href: ROUTES.ADMIN_WITHDRAWALS, label: "Withdrawals", icon: ArrowUpFromLine },
  { href: ROUTES.ADMIN_TRANSACTIONS, label: "Transactions", icon: ArrowLeftRight },
  { href: ROUTES.ADMIN_NOTIFICATIONS, label: "Notifications", icon: Bell },
  { href: ROUTES.ADMIN_SETTINGS, label: "Settings", icon: Settings },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full w-64 border-r border-border/50 bg-card/95 backdrop-blur-xl transition-transform lg:translate-x-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          <Link href={ROUTES.ADMIN} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-blue to-emerald flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold">Admin Panel</span>
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="p-3 space-y-1">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-border/50 p-3">
          <Button variant="ghost" className="w-full justify-start gap-3" asChild>
            <Link href={ROUTES.DASHBOARD}>Back to App</Link>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 mt-1" onClick={() => logout()}>
            <LogOut className="h-5 w-5" /> Logout
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <span className="ml-2 text-sm text-muted-foreground">Administration</span>
        </header>
        <main className="p-4 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
