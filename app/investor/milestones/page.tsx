"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Flag, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMilestones, useProjects, useI18n, useAuth } from "@/hooks";
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
import { hasActiveServiceAccess } from "@/lib/rbac";
import { ServicePaywall } from "@/components/shared/service-paywall";
import { toast } from "sonner";
import Link from "next/link";
import type { MilestonePlanStatus } from "@/types";

type DraftItem = { title: string; amount: string; dueDate: string };

function RequiredMark() {
  return <span className="text-destructive"> *</span>;
}

export default function InvestorMilestonesPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: plans = [], isLoading } = useMilestones();
  const { data: projectsPage } = useProjects({ limit: 50 });
  const projects = projectsPage?.data ?? [];
  const [open, setOpen] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<DraftItem[]>([{ title: "", amount: "", dueDate: "" }]);

  const hasAccess = hasActiveServiceAccess(user);

  useSetPageTitle(t("milestones.title"));

  const resetForm = () => {
    setProjectId("");
    setNotes("");
    setItems([{ title: "", amount: "", dueDate: "" }]);
  };

  const createMutation = useMutation({
    mutationFn: () =>
      milestonesApi.create({
        projectId,
        notes,
        items: items
          .filter((i) => i.title.trim() && Number(i.amount) > 0 && i.dueDate)
          .map((i) => ({
            title: i.title.trim(),
            amount: Number(i.amount),
            dueDate: i.dueDate,
          })),
      }),
    onSuccess: () => {
      toast.success(t("common.success"));
      setOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MILESTONES] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const respondMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: MilestonePlanStatus }) =>
      milestonesApi.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MILESTONES] });
      toast.success(t("common.success"));
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const validItems = items.filter(
    (i) => i.title.trim() && Number(i.amount) > 0 && i.dueDate
  );
  const canSubmit =
    Boolean(projectId) && validItems.length > 0 && !createMutation.isPending;

  const submit = () => {
    if (!projectId) {
      toast.error(t("milestones.projectRequired"));
      return;
    }
    if (validItems.length === 0) {
      toast.error(t("milestones.itemsRequired"));
      return;
    }
    createMutation.mutate();
  };

  return (
    <PanelPage>
      <PageHeader
        variant="minimal"
        title={t("milestones.title")}
        description={t("milestones.subtitle")}
        actions={
          hasAccess ? (
            <Button onClick={() => setOpen(true)}>{t("milestones.create")}</Button>
          ) : undefined
        }
      />
      <p className="text-xs text-amber-800">{t("milestones.offPlatformNote")}</p>

      {!hasAccess ? (
        <ServicePaywall />
      ) : isLoading ? (
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
                    href={`${ROUTES.INVESTOR_PROJECTS}/${plan.projectId}`}
                    className="font-display text-lg font-semibold text-foreground hover:text-primary"
                  >
                    {plan.projectTitle}
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {plan.ownerName} · {formatDate(plan.createdAt)}
                  </p>
                </div>
                <Badge className={STATUS_COLORS[plan.status] || ""}>{plan.status}</Badge>
              </div>
              <ul className="space-y-2">
                {plan.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/80 bg-secondary/40 px-3 py-2 text-sm"
                  >
                    <span>{item.title}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </li>
                ))}
              </ul>
              {plan.status === "proposed" && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
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

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) resetForm();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("milestones.createTitle")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>
                {t("milestones.project")}
                <RequiredMark />
              </Label>
              <Select value={projectId || undefined} onValueChange={setProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("milestones.projectPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {items.map((item, idx) => (
              <div key={idx} className="grid gap-3 rounded-xl border border-border bg-card p-3">
                <div className="flex items-center justify-between">
                  <Label>
                    {t("milestones.itemTitle")}
                    <RequiredMark />
                  </Label>
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setItems(items.filter((_, i) => i !== idx))}
                      aria-label={t("common.remove")}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </button>
                  )}
                </div>
                <Input
                  required
                  value={item.title}
                  onChange={(e) => {
                    const next = [...items];
                    next[idx] = { ...item, title: e.target.value };
                    setItems(next);
                  }}
                />
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label>
                      {t("milestones.amount")}
                      <RequiredMark />
                    </Label>
                    <Input
                      type="number"
                      required
                      min={1}
                      value={item.amount}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx] = { ...item, amount: e.target.value };
                        setItems(next);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>
                      {t("milestones.dueDate")}
                      <RequiredMark />
                    </Label>
                    <Input
                      type="date"
                      required
                      value={item.dueDate}
                      onChange={(e) => {
                        const next = [...items];
                        next[idx] = { ...item, dueDate: e.target.value };
                        setItems(next);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setItems([...items, { title: "", amount: "", dueDate: "" }])}
            >
              <Plus className="h-4 w-4" /> {t("milestones.addItem")}
            </Button>
            <div className="space-y-2">
              <Label>{t("milestones.notes")}</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
            <Button className="w-full" disabled={!canSubmit} onClick={submit}>
              {t("milestones.submit")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </PanelPage>
  );
}
