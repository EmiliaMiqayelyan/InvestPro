"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { contactApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { PLATFORM_NAME } from "@/constants";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  message: z.string().min(10, "Please write at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    setSending(true);
    try {
      await contactApi.send(values);
      toast.success("Message sent — we'll get back to you soon.");
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="hero-mesh border-b border-border/60">
        <div className="container-narrow section-pad py-16 md:py-20 animate-fade-in">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Contact</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900">
            Talk with {PLATFORM_NAME}
          </h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Questions about membership, listings, or diligence? Send a message and our team will
            respond.
          </p>
        </div>
      </section>

      <section className="container-narrow section-pad py-16">
        <div className="mx-auto max-w-xl animate-slide-up">
          <Card className="border-border/80 shadow-soft">
            <CardHeader>
              <CardTitle className="font-display text-xl">Send a message</CardTitle>
              <CardDescription>
                We typically respond within one business day. Do not share investment offers here —
                use the platform once you&apos;re signed in.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" {...register("name")} />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="How can we help?"
                    className="flex w-full rounded-lg border border-border bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="text-sm text-destructive">{errors.message.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={sending}>
                  {sending ? "Sending..." : "Send message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
