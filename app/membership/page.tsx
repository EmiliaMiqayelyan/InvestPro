"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMembershipPlans } from "@/hooks/use-marketplace";
import { membershipApi } from "@/services/api";
import { useAuthStore } from "@/store";
import { getErrorMessage } from "@/services/api/client";
import { ROUTES } from "@/constants";
import { formatCurrency } from "@/utils/format";
import { cn } from "@/lib/utils";
import type { MembershipPlanId } from "@/types";

export default function MembershipPage() {
  const { data: plans, isLoading } = useMembershipPlans();
  const { user, isAuthenticated, login } = useAuthStore();
  const [subscribing, setSubscribing] = useState<MembershipPlanId | null>(null);

  const canSubscribe = isAuthenticated && user?.role === "investor";

  const handleSubscribe = async (planId: MembershipPlanId) => {
    if (!isAuthenticated) {
      toast.error("Sign in as an investor to subscribe.");
      return;
    }
    if (user?.role !== "investor") {
      toast.error("Membership plans are available to investor accounts only.");
      return;
    }
    setSubscribing(planId);
    try {
      const { data } = await membershipApi.subscribe(planId);
      const { user: nextUser, tokens } = data.data;
      login(nextUser, tokens.accessToken, tokens.refreshToken);
      toast.success(`Subscribed to ${planId} successfully.`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubscribing(null);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <section className="hero-mesh border-b border-border/60">
        <div className="container-narrow section-pad py-16 md:py-20 animate-fade-in">
          <p className="text-sm font-medium uppercase tracking-wide text-blue-600">Membership</p>
          <h1 className="mt-3 font-display text-4xl font-semibold text-slate-900">
            Unlock full marketplace access
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Investor memberships open documents, team profiles, financial analysis, messaging, and
            investment offers. Choose the tier that matches how you diligence deals.
          </p>
          {!canSubscribe && (
            <p className="mt-4 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 max-w-xl">
              {isAuthenticated
                ? "You must be logged in as an investor to subscribe."
                : (
                  <>
                    Sign in as an investor to subscribe.{" "}
                    <Link href={ROUTES.LOGIN} className="font-medium underline">
                      Sign in
                    </Link>{" "}
                    or{" "}
                    <Link href={`${ROUTES.REGISTER}?role=investor`} className="font-medium underline">
                      create an investor account
                    </Link>
                    .
                  </>
                )}
            </p>
          )}
        </div>
      </section>

      <section className="container-narrow section-pad py-16">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading plans...</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-3 animate-slide-up">
            {(plans ?? []).map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "premium-card flex flex-col p-6",
                  plan.highlighted && "ring-2 ring-blue-600"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h2 className="font-display text-xl font-semibold">{plan.name}</h2>
                  {plan.highlighted && (
                    <Badge className="border-blue-200 bg-blue-50 text-blue-700">Recommended</Badge>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <p className="mt-6 font-display text-3xl font-semibold text-slate-900">
                  {formatCurrency(plan.price)}
                  <span className="text-sm font-normal text-muted-foreground">
                    /{plan.billingPeriod === "yearly" ? "year" : "month"}
                  </span>
                </p>
                {user?.membershipTier === plan.id && (
                  <p className="mt-2 text-xs font-medium text-emerald-600">Your current plan</p>
                )}
                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  disabled={!canSubscribe || subscribing === plan.id || user?.membershipTier === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {subscribing === plan.id ? (
                    "Subscribing..."
                  ) : user?.membershipTier === plan.id ? (
                    "Current plan"
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Subscribe
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </section>

      <MarketingFooter />
    </div>
  );
}
