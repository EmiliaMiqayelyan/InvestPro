"use client";

import Link from "next/link";
import {
  FolderKanban,
  Handshake,
  MessageSquare,
  BarChart3,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useOwnerDashboard } from "@/hooks/use-marketplace";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const links = [
  { href: ROUTES.OWNER_PROJECTS, label: "My projects", icon: FolderKanban },
  { href: ROUTES.OWNER_OFFERS, label: "Investor requests", icon: Handshake },
  { href: ROUTES.OWNER_MESSAGES, label: "Messages", icon: MessageSquare },
  { href: ROUTES.OWNER_ANALYTICS, label: "Analytics", icon: BarChart3 },
];

export default function OwnerDashboardPage() {
  const { data: stats, isLoading } = useOwnerDashboard();

  const cards = [
    { label: "My projects", value: stats?.myProjects ?? 0 },
    { label: "Published", value: stats?.publishedProjects ?? 0 },
    { label: "Investor requests", value: stats?.investorRequests ?? 0 },
    { label: "Pending offers", value: stats?.pendingOffers ?? 0 },
    { label: "Unread messages", value: stats?.unreadMessages ?? 0 },
    {
      label: "Funding raised",
      value: formatCurrency(stats?.totalFundingRaised ?? 0),
    },
    { label: "Team members", value: stats?.teamMembers ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">Dashboard</h2>
          <p className="text-sm text-muted-foreground">Project performance and pipeline</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href={ROUTES.OWNER_PROJECT_CREATE}>
            <Plus className="h-4 w-4" /> Create project
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
