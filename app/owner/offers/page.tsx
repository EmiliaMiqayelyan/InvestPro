"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Handshake } from "lucide-react";
import { useOffers } from "@/hooks/use-marketplace";
import { useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { offersApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { formatCurrency, formatDate } from "@/utils/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { InvestmentOffer, OfferStatus } from "@/types";
import { toast } from "sonner";

export default function OwnerOffersPage() {
  const { t } = useI18n();
  useSetPageTitle(t("nav.investorRequests"));
  const queryClient = useQueryClient();
  const { data: offersPage, isLoading } = useOffers();
  const offers = offersPage?.data ?? [];
  const [negotiateOffer, setNegotiateOffer] = useState<InvestmentOffer | null>(null);
  const [response, setResponse] = useState("");

  const respondMutation = useMutation({
    mutationFn: ({
      id,
      status,
      ownerResponse,
    }: {
      id: string;
      status: OfferStatus;
      ownerResponse?: string;
    }) => offersApi.respond(id, { status, ownerResponse }),
    onSuccess: () => {
      toast.success(t("offers.updated"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OFFERS] });
      setNegotiateOffer(null);
      setResponse("");
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
          {offers.map((offer) => (
            <PanelCard key={offer.id} className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-foreground">
                    {offer.projectTitle || t("common.projectFallback")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {offer.investorName || t("auth.investor")} · {formatDate(offer.createdAt)}
                  </p>
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
                  <p className="text-foreground">{offer.conditions || "—"}</p>
                </div>
              </div>
              {offer.status === "pending" && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    size="sm"
                    onClick={() =>
                      respondMutation.mutate({ id: offer.id, status: "accepted" })
                    }
                    disabled={respondMutation.isPending}
                  >
                    {t("owner.accept")}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      respondMutation.mutate({ id: offer.id, status: "rejected" })
                    }
                    disabled={respondMutation.isPending}
                  >
                    {t("owner.reject")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNegotiateOffer(offer);
                      setResponse("");
                    }}
                  >
                    {t("owner.negotiate")}
                  </Button>
                </div>
              )}
            </PanelCard>
          ))}
        </div>
      )}

      <Dialog open={!!negotiateOffer} onOpenChange={(o) => !o && setNegotiateOffer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("offers.negotiateTitle")}</DialogTitle>
          </DialogHeader>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder={t("offers.negotiatePlaceholder")}
            rows={4}
          />
          <Button
            disabled={!response.trim() || respondMutation.isPending}
            onClick={() =>
              negotiateOffer &&
              respondMutation.mutate({
                id: negotiateOffer.id,
                status: "negotiating",
                ownerResponse: response,
              })
            }
          >
            {t("offers.sendNegotiation")}
          </Button>
        </DialogContent>
      </Dialog>
    </PanelPage>
  );
}
