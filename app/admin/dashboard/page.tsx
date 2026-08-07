"use client";

import Link from "next/link";
import {
  Users,
  FolderKanban,
  CreditCard,
  Shield,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { useAdminStats } from "@/hooks/use-marketplace";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const links = [
  { href: ROUTES.ADMIN_USERS, label: "Users", icon: Users },
  { href: ROUTES.ADMIN_PROJECTS, label: "Projects", icon: FolderKanban },
  { href: ROUTES.ADMIN_PAYMENTS, label: "Payments", icon: CreditCard },
  { href: ROUTES.ADMIN_SECURITY, label: "Security", icon: Shield },
  { href: ROUTES.ADMIN_COMPLAINTS, label: "Complaints", icon: AlertTriangle },
];

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats();

  const cards = [
    { label: "Investors", value: stats?.totalInvestors ?? 0 },
    { label: "Project owners", value: stats?.totalOwners ?? 0 },
    { label: "Total projects", value: stats?.totalProjects ?? 0 },
    { label: "Published", value: stats?.publishedProjects ?? 0 },
    { label: "Pending review", value: stats?.pendingProjects ?? 0 },
    { label: "Active memberships", value: stats?.activeMemberships ?? 0 },
    { label: "Pending KYC", value: stats?.pendingKyc ?? 0 },
    { label: "Open complaints", value: stats?.openComplaints ?? 0 },
    { label: "Total offers", value: stats?.totalOffers ?? 0 },
    {
      label: "Total funding",
      value: formatCurrency(stats?.totalFunding ?? 0),
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Admin dashboard</h2>
        <p className="text-sm text-muted-foreground">Platform health and moderation overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card
            key={card.label}
            className="premium-card border-border bg-white shadow-none backdrop-blur-none"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-semibold text-slate-900">
                {isLoading ? "…" : card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="premium-card group p-5 transition hover:-translate-y-0.5"
            >
              <Icon className="mb-3 h-5 w-5 text-blue-600" />
              <p className="font-medium text-slate-900">{link.label}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600">
                Open <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
