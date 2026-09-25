"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Handshake } from "lucide-react";
import { toast } from "sonner";
import { useOffers } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { offersApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { InvestmentOffer } from "@/types";

function offerStatusLabel(t: (key: string) => string, status: InvestmentOffer["status"]) {
  switch (status) {
    case "pending":
      return t("offers.statusPending");
    case "accepted":
      return t("offers.statusAccepted");
    case "rejected":
      return t("offers.statusRejected");
    case "negotiating":
      return t("offers.statusNegotiating");
    case "cancelled":
      return t("offers.statusCancelled");
    default:
      return status;
  }
}

export default function InvestorOffersPage() {
  const { t } = useI18n();
  useSetPageTitle(t("nav.myOffers"));
  const queryClient = useQueryClient();
  const { data: offersPage, isLoading } = useOffers();
  const offers = offersPage?.data ?? [];
  const [pendingCancel, setPendingCancel] = useState<InvestmentOffer | null>(null);

  const cancelMutation = useMutation({
    mutationFn: (id: string) => offersApi.cancel(id),
    onSuccess: () => {
      toast.success(t("offers.cancelledToast"));
      setPendingCancel(null);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OFFERS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <PanelPage>
      {isLoading ? (
        <PanelBlockSkeleton height="h-40" />
      ) : offers.length === 0 ? (
        <EmptyState icon={Handshake} title={t("offers.empty")} />
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => {
            const canCancel =
              offer.status === "pending" || offer.status === "negotiating";
            return (
              <PanelCard key={offer.id} className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">
                      {offer.projectTitle || t("common.projectFallback")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(offer.createdAt)}
                    </p>
                  </div>
                  <Badge className={cn("border capitalize", STATUS_COLORS[offer.status])}>
                    {offerStatusLabel(t, offer.status)}
                  </Badge>
                </div>
                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">{t("offers.amountShort")}</p>
                    <p className="font-semibold text-foreground">
                      {formatCurrency(offer.amount)}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs text-muted-foreground">{t("offers.conditions")}</p>
                    <p className="text-foreground">
                      {offer.conditions || t("offers.noConditions")}
                    </p>
                  </div>
                </div>
                {offer.ownerResponse ? (
                  <div className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm">
                    <p className="text-xs text-muted-foreground">{t("offers.ownerResponse")}</p>
                    <p className="mt-1 text-foreground">{offer.ownerResponse}</p>
                  </div>
                ) : null}
                {canCancel ? (
                  <div className="border-t border-border/60 pt-4">
                    <Button
                      variant="outline"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={cancelMutation.isPending}
                      onClick={() => setPendingCancel(offer)}
                    >
                      {t("offers.cancelOffer")}
                    </Button>
                  </div>
                ) : null}
              </PanelCard>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={Boolean(pendingCancel)}
        onOpenChange={(open) => {
          if (!open) setPendingCancel(null);
        }}
        title={t("offers.cancelConfirm")}
        description={
          pendingCancel
            ? `${pendingCancel.projectTitle} · ${formatCurrency(pendingCancel.amount)}`
            : undefined
        }
        confirmLabel={t("offers.cancelOffer")}
        loading={cancelMutation.isPending}
        onConfirm={() => {
          if (!pendingCancel) return;
          cancelMutation.mutate(pendingCancel.id);
        }}
      />
    </PanelPage>
  );
}
