"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CRYPTO_CURRENCIES, QUERY_KEYS } from "@/constants";
import { depositsApi, walletApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { truncateAddress } from "@/utils/format";
import { toast } from "sonner";
import type { CryptoCurrency } from "@/types";

const schema = z.object({
  amount: z.coerce.number().min(0.0001, "Amount required"),
  txHash: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function DepositCryptoPage() {
  const [crypto, setCrypto] = useState<CryptoCurrency>("BTC");
  const queryClient = useQueryClient();

  const { data: addresses } = useQuery({
    queryKey: [QUERY_KEYS.CRYPTO_ADDRESSES],
    queryFn: async () => {
      const { data } = await walletApi.getCryptoAddresses();
      return data.data;
    },
  });

  const address = addresses?.find((a) => a.currency === crypto);

  const generateMutation = useMutation({
    mutationFn: () => walletApi.generateCryptoAddress(crypto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CRYPTO_ADDRESSES] });
      toast.success("Address generated");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const depositMutation = useMutation({
    mutationFn: (data: FormData) =>
      depositsApi.create({
        amount: data.amount,
        paymentMethod: "cryptocurrency",
        cryptoCurrency: crypto,
      }),
    onSuccess: () => {
      toast.success("Crypto deposit submitted for verification");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEPOSITS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const copyAddress = () => {
    if (address?.address) {
      navigator.clipboard.writeText(address.address);
      toast.success("Address copied");
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Deposit Crypto</h1>
        <p className="text-muted-foreground">Send crypto to your wallet address</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Cryptocurrency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select value={crypto} onValueChange={(v) => setCrypto(v as CryptoCurrency)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CRYPTO_CURRENCIES.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label} — {c.network}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {address ? (
            <div className="glass-card p-6 space-y-4">
              <div className="flex items-center justify-center">
                <div className="h-32 w-32 bg-muted rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm bg-muted p-3 rounded-lg break-all">
                  {address.address}
                </code>
                <Button variant="outline" size="icon" onClick={copyAddress}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Network: {address.network} — Only send {crypto} to this address
              </p>
            </div>
          ) : (
            <Button
              variant="gradient"
              onClick={() => generateMutation.mutate()}
              disabled={generateMutation.isPending}
            >
              Generate Deposit Address
            </Button>
          )}

          <form onSubmit={handleSubmit((d) => depositMutation.mutate(d))} className="space-y-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" step="any" placeholder="0.00" {...register("amount")} />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Transaction Hash (optional)</Label>
              <Input placeholder="0x..." {...register("txHash")} />
            </div>
            <Button type="submit" variant="gradient" className="w-full" disabled={depositMutation.isPending}>
              {depositMutation.isPending ? "Submitting..." : "Confirm Deposit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
