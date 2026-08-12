"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Shield } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useMembershipPlans, useMyMembership, useI18n } from "@/hooks";
import { useAuthStore } from "@/store";
import { membershipApi } from "@/services/api";
import { getErrorMessage, setTokens } from "@/services/api/client";
import { ROUTES, QUERY_KEYS } from "@/constants";
import { hasActiveServiceAccess } from "@/lib/rbac";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";

export default function MembershipPage() {
  const { t, isHy } = useI18n();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const { data: plans = [], isLoading } = useMembershipPlans();
  const { data: mine } = useMyMembership();
  const [activating, setActivating] = useState(false);
  const inInvestorPanel = pathname.startsWith("/investor");

  const plan = plans[0];
  const hasAccess = hasActiveServiceAccess(user);

  const activate = async () => {
    if (!isAuthenticated || user?.role !== "investor") {
      toast.error(t("membership.loginRequired"));
      return;
    }
    setActivating(true);
    try {
      await membershipApi.checkout("service");
      const { data } = await membershipApi.subscribe("service");
      if (data.data.tokens) {
        setTokens(data.data.tokens.accessToken, data.data.tokens.refreshToken);
      }
      setUser(data.data.user);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBERSHIP] });
      toast.success(t("membership.activated"));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setActivating(false);
    }
  };

  useEffect(() => {
    if (searchParams.get("checkout") === "mock" && isAuthenticated && user?.role === "investor" && !hasAccess) {
      void activate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const features = isHy && plan?.featuresHy?.length ? plan.featuresHy : plan?.features || [];

  return (
    <div className={inInvestorPanel ? "" : "min-h-screen bg-[hsl(var(--background))]"}>
      {!inInvestorPanel && <MarketingHeader />}
      <section className={inInvestorPanel ? "" : "hero-mesh border-b border-border/70"}>
        <div className={inInvestorPanel ? "pb-6" : "container-narrow section-pad py-16 md:py-20"}>
          {!inInvestorPanel && (
            <p className="text-sm font-medium uppercase tracking-wide text-teal-800">
              {t("membership.eyebrow")}
            </p>
          )}
          <h1
            className={
              inInvestorPanel
                ? "font-display text-2xl font-semibold text-slate-900 md:text-3xl"
                : "mt-3 max-w-2xl font-display text-3xl font-semibold text-slate-900 md:text-4xl"
            }
          >
            {t("membership.heroTitle")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground md:text-base">
            {t("membership.heroSub")}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1.5 text-sm text-teal-900">
            <Shield className="h-4 w-4" />
            {t("membership.notCapital")}
          </div>
        </div>
      </section>

      <section className={inInvestorPanel ? "pt-2" : "container-narrow section-pad py-14"}>
        {isLoading || !plan ? (
          <p className="text-sm text-muted-foreground">{t("membership.loadingPlans")}</p>
        ) : (
          <div className="premium-card mx-auto max-w-lg p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-slate-900">
                  {isHy && plan.nameHy ? plan.nameHy : plan.name}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {isHy && plan.descriptionHy ? plan.descriptionHy : plan.description}
                </p>
              </div>
              {hasAccess && <Badge className="bg-teal-700 text-white">{t("membership.current")}</Badge>}
            </div>
            <p className="mt-6 font-display text-4xl font-semibold text-slate-900">
              {formatCurrency(plan.price)}
              <span className="text-base font-normal text-muted-foreground">
                {t("membership.monthly")}
              </span>
            </p>
            <p className="mt-6 text-sm font-medium text-slate-900">{t("membership.unlocks")}</p>
            <ul className="mt-3 space-y-2">
              {features.map((f) => (
                <li key={f} className="flex gap-2 text-sm text-slate-700">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                  {f}
                </li>
              ))}
            </ul>
            {hasAccess ? (
              <p className="mt-8 text-sm text-teal-800">
                {t("membership.yourCurrent")}
                {mine?.expiresAt ? ` · ${new Date(mine.expiresAt).toLocaleDateString()}` : ""}
              </p>
            ) : !isAuthenticated ? (
              <div className="mt-8 space-y-3">
                <p className="text-sm text-muted-foreground">{t("membership.loginRequired")}</p>
                <Button asChild className="w-full">
                  <Link href={`${ROUTES.LOGIN}?next=/membership`}>{t("common.signIn")}</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href={`${ROUTES.REGISTER}?role=investor`}>{t("membership.createInvestor")}</Link>
                </Button>
              </div>
            ) : user?.role !== "investor" ? (
              <p className="mt-8 text-sm text-muted-foreground">{t("membership.investorOnly")}</p>
            ) : (
              <Button className="mt-8 w-full" size="lg" disabled={activating} onClick={() => void activate()}>
                {activating ? t("membership.subscribing") : t("membership.subscribe")}
              </Button>
            )}
          </div>
        )}
      </section>
      {!inInvestorPanel && <MarketingFooter />}
    </div>
  );
}
