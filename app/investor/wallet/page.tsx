"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Landmark, TrendingUp, Wallet } from "lucide-react";
import { walletApi } from "@/services/api";
import { QUERY_KEYS, STATUS_COLORS } from "@/constants";
import { getErrorMessage } from "@/services/api/client";
import { formatCurrency, formatDate } from "@/utils/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelCard } from "@/components/shared/panel-card";
import { EmptyState } from "@/components/shared/empty-state";
import { StatCard } from "@/components/shared/stat-card";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { useI18n } from "@/hooks";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function idemKey(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export default function InvestorWalletPage() {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  useSetPageTitle(t("investor.walletTitle"));
  const [amount, setAmount] = useState("100");

  const { data: wallet, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.WALLET],
    queryFn: async () => (await walletApi.get()).data.data,
  });

  const { data: txPage } = useQuery({
    queryKey: [QUERY_KEYS.WALLET_TX],
    queryFn: async () => (await walletApi.transactions({ limit: 20 })).data.data,
  });

  const depositMutation = useMutation({
    mutationFn: () => walletApi.deposit(Number(amount), idemKey("deposit")),
    onSuccess: () => {
      toast.success(t("investor.depositSuccess"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_TX] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const withdrawMutation = useMutation({
    mutationFn: () =>
      walletApi.withdraw(
        {
          amount: Number(amount),
          destination: { type: "bank", bankName: "Primary", accountNumber: "****0000" },
        },
        idemKey("withdraw")
      ),
    onSuccess: () => {
      toast.success(t("investor.withdrawSuccess"));
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET_TX] });
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const transactions = txPage?.data ?? [];

  return (
    <PanelPage maxWidth="content">
      <PageHeader
        variant="minimal"
        title={t("investor.walletTitle")}
        description={t("investor.walletSub")}
      />

      {isLoading ? (
        <PanelBlockSkeleton height="h-32" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title={t("investor.available")}
            value={formatCurrency(wallet?.availableBalance ?? 0)}
            icon={Wallet}
            accent="primary"
          />
          <StatCard
            title={t("investor.pending")}
            value={formatCurrency(wallet?.pendingBalance ?? 0)}
            icon={Clock}
            accent="gold"
          />
          <StatCard
            title={t("investor.invested")}
            value={formatCurrency(wallet?.investedBalance ?? 0)}
            icon={TrendingUp}
            accent="success"
          />
          <StatCard
            title={t("investor.totalBalance")}
            value={formatCurrency(wallet?.totalBalance ?? 0)}
            icon={Landmark}
            accent="default"
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base text-foreground">
            <Wallet className="h-5 w-5 text-primary" />
            {t("investor.deposit")} / {t("investor.withdraw")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("investor.amount")}</Label>
            <Input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => depositMutation.mutate()}
              disabled={depositMutation.isPending || !Number(amount)}
            >
              {t("investor.deposit")}
            </Button>
            <Button
              variant="outline"
              onClick={() => withdrawMutation.mutate()}
              disabled={withdrawMutation.isPending || !Number(amount)}
            >
              {t("investor.withdraw")}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h2 className="font-display text-lg font-semibold">{t("investor.transactions")}</h2>
        {transactions.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title={t("investor.noTransactions")}
          />
        ) : (
          transactions.map((tx) => (
            <PanelCard
              key={tx.id}
              padding="sm"
              className="flex flex-wrap items-center justify-between gap-3"
            >
              <div>
                <p className="font-medium capitalize text-foreground">{tx.type}</p>
                <p className="text-xs text-muted-foreground">
                  {tx.description || tx.referenceType || "—"} · {formatDate(tx.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-foreground">{formatCurrency(tx.amount)}</p>
                <Badge className={cn("border capitalize", STATUS_COLORS[tx.status] || STATUS_COLORS.pending)}>
                  {tx.status}
                </Badge>
              </div>
            </PanelCard>
          ))
        )}
      </div>
    </PanelPage>
  );
}
