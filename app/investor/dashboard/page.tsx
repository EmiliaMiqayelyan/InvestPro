"use client";

import Link from "next/link";
import {
  Briefcase,
  Handshake,
  MessageSquare,
  Bookmark,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import { useInvestorDashboard } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function InvestorDashboardPage() {
  const { t } = useI18n();
  const { data: stats, isLoading } = useInvestorDashboard();

  const links = [
    { href: ROUTES.PROJECTS, label: t("investor.browseProjects"), icon: Briefcase },
    { href: ROUTES.INVESTOR_INVESTMENTS, label: t("investor.myInvestments"), icon: Handshake },
    { href: ROUTES.INVESTOR_MESSAGES, label: t("nav.messages"), icon: MessageSquare },
    { href: ROUTES.MEMBERSHIP, label: t("investor.membershipStatus"), icon: CreditCard },
  ];

  const cards = [
    { label: t("investor.availableProjects"), value: stats?.availableProjects ?? 0 },
    { label: t("investor.myInvestments"), value: stats?.myInvestments ?? 0 },
    { label: t("investor.savedProjects"), value: stats?.savedProjects ?? 0 },
    { label: t("investor.unreadMessages"), value: stats?.unreadMessages ?? 0 },
    {
      label: t("investor.portfolioValue"),
      value: formatCurrency(stats?.portfolioValue ?? 0),
    },
    { label: t("investor.activeOffers"), value: stats?.activeOffers ?? 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-semibold text-slate-900">
            {t("investor.dashboard")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("investor.overview")}</p>
        </div>
        {stats?.membershipTier && (
          <Badge className="border border-blue-200 bg-blue-50 capitalize text-blue-700">
            {t("investor.planBadge", { tier: stats.membershipTier })}
          </Badge>
        )}
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
                {t("common.open")}{" "}
                <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link href={ROUTES.INVESTOR_SAVED}>
            <Bookmark className="h-4 w-4" /> {t("investor.savedProjects")}
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href={ROUTES.INVESTOR_KYC}>{t("investor.completeVerification")}</Link>
        </Button>
      </div>
    </div>
  );
}
