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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTES, PAYMENT_METHODS, QUERY_KEYS } from "@/constants";
import { withdrawalsApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";
import type { PaymentMethod } from "@/types";

const schema = z.object({
  amount: z.coerce.number().min(10, "Minimum withdrawal is $10"),
  destinationAddress: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function WithdrawPage() {
  const [method, setMethod] = useState<PaymentMethod>("mastercard");
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      withdrawalsApi.create({
        amount: data.amount,
        paymentMethod: method,
        destinationAddress: data.destinationAddress,
      }),
    onSuccess: () => {
      toast.success("Withdrawal request submitted");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WALLET] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WITHDRAWALS] });
      reset();
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Withdraw Funds</h1>
        <p className="text-muted-foreground">Withdraw money from your wallet</p>
      </div>

      <Tabs value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
        <TabsList className="grid w-full grid-cols-3">
          {PAYMENT_METHODS.map((pm) => (
            <TabsTrigger key={pm.value} value={pm.value}>{pm.label}</TabsTrigger>
          ))}
        </TabsList>

        {PAYMENT_METHODS.map((pm) => (
          <TabsContent key={pm.value} value={pm.value}>
            <Card>
              <CardHeader>
                <CardTitle>Withdraw via {pm.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (USD)</Label>
                    <Input id="amount" type="number" step="0.01" {...register("amount")} />
                    {errors.amount && (
                      <p className="text-sm text-destructive">{errors.amount.message}</p>
                    )}
                  </div>
                  {pm.value === "cryptocurrency" && (
                    <div className="space-y-2">
                      <Label htmlFor="destinationAddress">Destination Address</Label>
                      <Input id="destinationAddress" {...register("destinationAddress")} />
                    </div>
                  )}
                  <Button type="submit" variant="gradient" className="w-full" disabled={mutation.isPending}>
                    {mutation.isPending ? "Processing..." : "Withdraw"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
