"use client";

import Link from "next/link";
import { ArrowDownToLine, ArrowUpFromLine, Clock, Wallet as WalletIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/shared/stat-card";
import { StatsSkeleton } from "@/components/shared/loading-skeleton";
import { ROUTES } from "@/constants";
import { useWallet } from "@/hooks";
import { formatCurrency } from "@/utils/format";

export default function WalletPage() {
  const { data: wallet, isLoading } = useWallet();

  if (isLoading) return <StatsSkeleton count={3} />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">Manage your funds and transactions</p>
        </div>
        <div className="flex gap-3">
          <Button variant="gradient" asChild>
            <Link href={ROUTES.DEPOSIT}>
              <ArrowDownToLine className="mr-2 h-4 w-4" /> Deposit
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href={ROUTES.WITHDRAW}>
              <ArrowUpFromLine className="mr-2 h-4 w-4" /> Withdraw
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Available Balance"
          value={formatCurrency(wallet?.availableBalance ?? 0)}
          icon={WalletIcon}
        />
        <StatCard
          title="Pending Balance"
          value={formatCurrency(wallet?.pendingBalance ?? 0)}
          icon={Clock}
        />
        <StatCard
          title="Total Balance"
          value={formatCurrency(wallet?.totalBalance ?? 0)}
          icon={WalletIcon}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[
          { href: ROUTES.DEPOSIT_CRYPTO, title: "Deposit Crypto", desc: "BTC, ETH, USDT, USDC" },
          { href: ROUTES.WITHDRAW_CRYPTO, title: "Withdraw Crypto", desc: "Send to external wallet" },
          { href: ROUTES.WALLET_ADDRESSES, title: "Wallet Addresses", desc: "Your deposit addresses" },
          { href: ROUTES.DEPOSIT_HISTORY, title: "Deposit History", desc: "View all deposits" },
          { href: ROUTES.WITHDRAW_HISTORY, title: "Withdrawal History", desc: "View all withdrawals" },
          { href: ROUTES.TRANSACTIONS, title: "All Transactions", desc: "Complete transaction log" },
        ].map((item) => (
          <Card key={item.href} className="hover:border-primary/30 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
              <Button variant="outline" size="sm" asChild>
                <Link href={item.href}>Open</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
