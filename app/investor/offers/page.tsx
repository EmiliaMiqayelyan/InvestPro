"use client";

import { Handshake } from "lucide-react";
import { useOffers } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function InvestorOffersPage() {
  const { t } = useI18n();
  useSetPageTitle(t("nav.myOffers"));
  const { data: offersPage, isLoading } = useOffers();
  const offers = offersPage?.data ?? [];

  return (
    <PanelPage>
      {isLoading ? (
        <PanelBlockSkeleton height="h-40" />
      ) : offers.length === 0 ? (
        <EmptyState icon={Handshake} title={t("offers.empty")} />
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <PanelCard key={offer.id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">
                    {offer.projectTitle || t("common.projectFallback")}
                  </p>
                  <p className="text-sm text-muted-foreground">{formatDate(offer.createdAt)}</p>
                </div>
                <Badge className={cn("border capitalize", STATUS_COLORS[offer.status])}>
                  {offer.status}
                </Badge>
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">{t("offers.amountShort")}</p>
                  <p className="font-semibold text-foreground">{formatCurrency(offer.amount)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">{t("offers.conditions")}</p>
                  <p className="text-foreground">{offer.conditions || t("offers.noConditions")}</p>
                </div>
              </div>
              {offer.ownerResponse ? (
                <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                  <p className="text-xs text-muted-foreground">{t("offers.ownerResponse")}</p>
                  <p className="mt-1 text-foreground">{offer.ownerResponse}</p>
                </div>
              ) : null}
            </PanelCard>
          ))}
        </div>
      )}
    </PanelPage>
  );
}
