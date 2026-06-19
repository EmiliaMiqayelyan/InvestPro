"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { withdrawalsApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";
import type { CryptoCurrency } from "@/types";

const schema = z.object({
  amount: z.coerce.number().min(0.0001, "Amount required"),
  destinationAddress: z.string().min(10, "Valid address required"),
});

type FormData = z.infer<typeof schema>;

export default function WithdrawCryptoPage() {
  const [crypto, setCrypto] = useState<CryptoCurrency>("BTC");
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      withdrawalsApi.create({
        amount: data.amount,
        paymentMethod: "cryptocurrency",
        cryptoCurrency: crypto,
        destinationAddress: data.destinationAddress,
      }),
    onSuccess: () => {
      toast.success("Crypto withdrawal submitted");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WITHDRAWALS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] });
      reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Withdraw Crypto</h1>
        <p className="text-muted-foreground">Send crypto to an external wallet</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
            <div className="space-y-2">
              <Label>Cryptocurrency</Label>
              <Select value={crypto} onValueChange={(v) => setCrypto(v as CryptoCurrency)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CRYPTO_CURRENCIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount</Label>
              <Input type="number" step="any" {...register("amount")} />
              {errors.amount && (
                <p className="text-sm text-destructive">{errors.amount.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Destination Address</Label>
              <Input placeholder="Enter wallet address" {...register("destinationAddress")} />
              {errors.destinationAddress && (
                <p className="text-sm text-destructive">{errors.destinationAddress.message}</p>
              )}
            </div>
            <Button type="submit" variant="gradient" className="w-full" disabled={mutation.isPending}>
              {mutation.isPending ? "Processing..." : "Withdraw"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
