"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Handshake } from "lucide-react";
import { useOffers } from "@/hooks/use-marketplace";
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
      toast.success("Offer updated");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OFFERS] });
      setNegotiateOffer(null);
      setResponse("");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          Investor requests
        </h2>
        <p className="text-sm text-muted-foreground">Accept, reject, or negotiate offers</p>
      </div>

      {isLoading ? (
        <div className="premium-card h-40 animate-pulse bg-slate-100" />
      ) : offers.length === 0 ? (
        <div className="premium-card flex flex-col items-center gap-3 p-12 text-center">
          <Handshake className="h-10 w-10 text-slate-300" />
          <p className="font-medium text-slate-900">No offers yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => (
            <div key={offer.id} className="premium-card space-y-4 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {offer.projectTitle || "Project"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {offer.investorName || "Investor"} · {formatDate(offer.createdAt)}
                  </p>
                </div>
                <Badge className={cn("border capitalize", STATUS_COLORS[offer.status])}>
                  {offer.status}
                </Badge>
              </div>
              <div className="grid gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Amount</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(offer.amount)}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Conditions</p>
                  <p className="text-slate-700">{offer.conditions || "—"}</p>
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
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() =>
                      respondMutation.mutate({ id: offer.id, status: "rejected" })
                    }
                    disabled={respondMutation.isPending}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNegotiateOffer(offer);
                      setResponse("");
                    }}
                  >
                    Negotiate
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!negotiateOffer} onOpenChange={(o) => !o && setNegotiateOffer(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Negotiate offer</DialogTitle>
          </DialogHeader>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Share your counter-terms…"
            rows={4}
          />
          <Button
            className="bg-blue-600 hover:bg-blue-700"
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
            Send negotiation
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
