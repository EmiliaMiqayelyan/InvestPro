"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMilestones, useI18n } from "@/hooks";
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
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">
          {t("milestones.title")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("milestones.subtitle")}</p>
        <p className="mt-2 text-xs text-amber-800">{t("milestones.offPlatformNote")}</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      ) : plans.length === 0 ? (
        <div className="premium-card p-10 text-center text-sm text-muted-foreground">
          {t("milestones.empty")}
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map((plan) => (
            <div key={plan.id} className="premium-card space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Link
                    href={`${ROUTES.OWNER_PROJECTS}`}
                    className="font-display text-lg font-semibold text-slate-900 hover:text-teal-800"
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
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/80 bg-slate-50/80 px-3 py-2 text-sm"
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
