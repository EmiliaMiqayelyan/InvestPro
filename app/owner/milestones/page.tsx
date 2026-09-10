"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMilestones, useI18n } from "@/hooks";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { PanelListSkeleton } from "@/components/shared/loading-skeleton";
import { milestonesApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { QUERY_KEYS, STATUS_COLORS, ROUTES } from "@/constants";
import { formatCurrency, formatDate } from "@/utils/format";
import { toast } from "sonner";
import Link from "next/link";
import type { MilestonePlanStatus } from "@/types";

export default function OwnerMilestonesPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const { data: plans = [], isLoading } = useMilestones();

  useSetPageTitle(t("milestones.title"));

  const respondMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MilestonePlanStatus }) =>
      milestonesApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MILESTONES] });
      toast.success(t("common.success"));
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("milestones.title")}
        description={t("milestones.subtitle")}
      />
      <p className="text-xs text-amber-800">{t("milestones.offPlatformNote")}</p>

      {isLoading ? (
        <PanelListSkeleton />
      ) : plans.length === 0 ? (
        <EmptyState icon={Flag} title={t("milestones.empty")} />
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <PanelCard key={plan.id} className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link
                    href={`${ROUTES.OWNER_PROJECTS}`}
                    className="font-display text-lg font-semibold text-foreground hover:text-primary"
                  >
                    {plan.projectTitle}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {plan.investorName} · {formatDate(plan.createdAt)}
                  </p>
                </div>
                <Badge className={STATUS_COLORS[plan.status] || ""}>{plan.status}</Badge>
              </div>
              <ul className="space-y-2">
                {plan.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/80 bg-muted/50 px-3 py-2 text-sm"
                  >
                    <span>{item.title}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </li>
                ))}
              </ul>
              {(plan.status === "proposed" || plan.status === "negotiating") && (
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => respondMutation.mutate({ id: plan.id, status: "agreed" })}
                  >
                    {t("milestones.accept")}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => respondMutation.mutate({ id: plan.id, status: "negotiating" })}
                  >
                    {t("milestones.negotiate")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => respondMutation.mutate({ id: plan.id, status: "cancelled" })}
                  >
                    {t("milestones.reject")}
                  </Button>
                </div>
              )}
            </PanelCard>
          ))}
        </div>
      )}
    </PanelPage>
  );
}
