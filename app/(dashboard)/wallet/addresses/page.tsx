"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, Plus, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { CRYPTO_CURRENCIES, QUERY_KEYS } from "@/constants";
import { useCryptoAddresses } from "@/hooks";
import { walletApi } from "@/services/api";
import { truncateAddress } from "@/utils/format";
import { toast } from "sonner";
import type { CryptoCurrency } from "@/types";

export default function WalletAddressesPage() {
  const { data: addresses, isLoading } = useCryptoAddresses();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: (currency: string) => walletApi.generateCryptoAddress(currency),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CRYPTO_ADDRESSES] });
      toast.success("Address generated");
    },
  });

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied");
  };

  if (isLoading) return <DataTableSkeleton rows={3} columns={3} />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Wallet Addresses</h1>
        <p className="text-muted-foreground">Your crypto deposit addresses</p>
      </div>

      {!addresses?.length ? (
        <EmptyState
          icon={Wallet}
          title="No addresses yet"
          description="Generate a deposit address for your preferred cryptocurrency"
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((addr) => (
            <Card key={addr.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">{addr.currency}</CardTitle>
                <Badge variant="active">{addr.network}</Badge>
              </CardHeader>
              <CardContent>
                <code className="text-sm break-all">{truncateAddress(addr.address, 12, 8)}</code>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => copyAddress(addr.address)}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy Address
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Generate New Address</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {CRYPTO_CURRENCIES.map((c) => (
            <Button
              key={c.value}
              variant="outline"
              size="sm"
              onClick={() => generateMutation.mutate(c.value)}
              disabled={generateMutation.isPending}
            >
              <Plus className="mr-2 h-4 w-4" /> {c.label}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
