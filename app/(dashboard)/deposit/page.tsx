"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { CreditCard, Bitcoin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES, PAYMENT_METHODS, QUERY_KEYS } from "@/constants";
import { depositsApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";
import type { PaymentMethod } from "@/types";

const schema = z.object({
  amount: z.coerce.number().min(10, "Minimum deposit is $10"),
});

type FormData = z.infer<typeof schema>;

export default function DepositPage() {
  const [method, setMethod] = useState<PaymentMethod>("mastercard");
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      depositsApi.create({ amount: data.amount, paymentMethod: method }),
    onSuccess: () => {
      toast.success("Deposit request submitted");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.DEPOSITS] });
      reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Deposit Funds</h1>
        <p className="text-muted-foreground">Add money to your wallet</p>
      </div>

      <Tabs value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
        <TabsList className="grid w-full grid-cols-3">
          {PAYMENT_METHODS.map((pm) => (
            <TabsTrigger key={pm.value} value={pm.value}>
              {pm.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PAYMENT_METHODS.map((pm) => (
          <TabsContent key={pm.value} value={pm.value}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {pm.value === "cryptocurrency" ? (
                    <Bitcoin className="h-5 w-5" />
                  ) : (
                    <CreditCard className="h-5 w-5" />
                  )}
                  Deposit via {pm.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pm.value === "cryptocurrency" ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">
                      For crypto deposits, use our dedicated crypto deposit page
                    </p>
                    <Button variant="gradient" asChild>
                      <Link href={ROUTES.DEPOSIT_CRYPTO}>Go to Crypto Deposit</Link>
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (USD)</Label>
                      <Input
                        id="amount"
                        type="number"
                        step="0.01"
                        placeholder="100.00"
                        {...register("amount")}
                      />
                      {errors.amount && (
                        <p className="text-sm text-destructive">{errors.amount.message}</p>
                      )}
                    </div>
                    <Button type="submit" variant="gradient" className="w-full" disabled={mutation.isPending}>
                      {mutation.isPending ? "Processing..." : "Deposit"}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
