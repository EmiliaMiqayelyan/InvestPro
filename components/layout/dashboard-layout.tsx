"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  FolderKanban,
  ArrowLeftRight,
  Bell,
  User,
  Shield,
  FileCheck,
  LogOut,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants";
import { useAuth } from "@/hooks";
import { useUIStore } from "@/store";
import { useUnreadNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/utils/format";

const navItems = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.WALLET, label: "Wallet", icon: Wallet },
  { href: ROUTES.PROJECTS, label: "Projects", icon: FolderKanban },
  { href: ROUTES.INVESTMENTS, label: "Investments", icon: TrendingUp },
  { href: ROUTES.TRANSACTIONS, label: "Transactions", icon: ArrowLeftRight },
  { href: ROUTES.NOTIFICATIONS, label: "Notifications", icon: Bell },
  { href: ROUTES.PROFILE, label: "Profile", icon: User },
  { href: ROUTES.SECURITY, label: "Security", icon: Shield },
  { href: ROUTES.KYC, label: "KYC Verification", icon: FileCheck },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { sidebarOpen, setSidebarOpen, mobileMenuOpen, setMobileMenuOpen } =
    useUIStore();
  const { data: unreadCount } = useUnreadNotifications();

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full border-r border-border/50 bg-card/95 backdrop-blur-xl transition-all duration-300",
          sidebarOpen ? "w-64" : "w-20",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-4">
          {sidebarOpen && (
            <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-blue to-emerald flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">InvestPro</span>
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                !sidebarOpen && "rotate-180"
              )}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
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
                <item.icon className="h-5 w-5 shrink-0" />
                {sidebarOpen && (
                  <span className="flex-1">{item.label}</span>
                )}
                {sidebarOpen && item.href === ROUTES.NOTIFICATIONS && unreadCount ? (
                  <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {unreadCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/50 p-3">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2",
              !sidebarOpen && "justify-center"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>
                {user ? getInitials(user.firstName, user.lastName) : "U"}
              </AvatarFallback>
            </Avatar>
            {sidebarOpen && user && (
              <div className="flex-1 truncate">
                <p className="text-sm font-medium truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            className={cn("mt-2 w-full justify-start gap-3", !sidebarOpen && "justify-center px-0")}
            onClick={() => logout()}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen && "Logout"}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div
        className={cn(
          "transition-all duration-300",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-xl px-4 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </header>
        <main className="p-4 lg:p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
