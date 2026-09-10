"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Shield, Sparkles } from "lucide-react";
import { MarketingHeader, MarketingFooter } from "@/components/layout/marketing-shell";
import { PageHeroBanner } from "@/components/shared/page-hero-banner";
import { ImageSplitSection } from "@/components/shared/image-split-section";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMembershipPlans, useMyMembership, useI18n } from "@/hooks";
import { useAuthStore } from "@/store";
import { membershipApi } from "@/services/api";
import { getErrorMessage, setTokens } from "@/services/api/client";
import { ROUTES, QUERY_KEYS } from "@/constants";
import { THEMATIC_IMAGES } from "@/constants/thematic-images";
import { hasActiveServiceAccess } from "@/lib/rbac";
import { useSetPageTitle } from "@/components/providers/page-title-provider";
import { PageHeader } from "@/components/shared/page-header";
import { PanelPage } from "@/components/shared/panel-page";
import { PanelBlockSkeleton } from "@/components/shared/loading-skeleton";
import { formatCurrency } from "@/utils/format";
import { toast } from "sonner";
import type { TranslationKey } from "@/i18n";

const NOT_INCLUDED_KEYS = [
  "membership.notIncludedCapital",
  "membership.notIncludedReturns",
  "membership.notIncludedOffPlatform",
  "membership.notIncludedAdvice",
] as const satisfies readonly TranslationKey[];

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

  useSetPageTitle(t("membership.title"));

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

  const pricingCard = (
    <Card className="relative overflow-hidden surface-card">
      <div className="absolute right-4 top-4">
        <Badge variant="gold" className="gap-1">
          <Sparkles className="h-3 w-3" />
          {t("common.recommended")}
        </Badge>
      </div>
      <CardContent className="p-8">
        <div className="flex items-start justify-between gap-4 pr-24">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">
              {isHy && plan?.nameHy ? plan.nameHy : plan?.name}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isHy && plan?.descriptionHy ? plan.descriptionHy : plan?.description}
            </p>
          </div>
          {hasAccess && <Badge variant="teal">{t("membership.current")}</Badge>}
        </div>
        <p className="mt-6 font-display text-4xl font-semibold text-foreground">
          {formatCurrency(plan?.price ?? 0)}
          <span className="text-base font-normal text-muted-foreground">
            {t("membership.monthly")}
          </span>
        </p>
        <p className="mt-6 text-sm font-medium text-foreground">{t("membership.unlocks")}</p>
        <ul className="mt-3 space-y-2.5">
          {features.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm text-foreground/80">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {f}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm font-medium text-foreground">{t("membership.notIncludedTitle")}</p>
        <ul className="mt-3 space-y-2">
          {NOT_INCLUDED_KEYS.map((key) => (
            <li key={key} className="text-sm text-muted-foreground">
              • {t(key)}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
          {t("membership.refundPolicy")}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{t("membership.lockedWithout")}</p>
        {hasAccess ? (
          <p className="mt-8 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
            {t("membership.yourCurrent")}
            {mine?.expiresAt ? ` · ${new Date(mine.expiresAt).toLocaleDateString()}` : ""}
          </p>
        ) : !isAuthenticated ? (
          <div className="mt-8 space-y-3">
            <p className="text-sm text-muted-foreground">{t("membership.loginRequired")}</p>
            <Button asChild className="w-full">
              <Link href={`${ROUTES.LOGIN}?next=/investor/membership`}>{t("common.signIn")}</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href={`${ROUTES.REGISTER}?role=investor`}>{t("membership.createInvestor")}</Link>
            </Button>
          </div>
        ) : user?.role !== "investor" ? (
          <p className="mt-8 text-sm text-muted-foreground">{t("membership.investorOnly")}</p>
        ) : (
          <Button className="mt-8 w-full" size="lg" variant="gold" disabled={activating} onClick={() => void activate()}>
            {activating ? t("membership.subscribing") : t("membership.subscribe")}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  if (inInvestorPanel) {
    return (
      <PanelPage>
        <PageHeader
          variant="minimal"
          title={t("membership.heroTitle")}
          description={t("membership.heroSub")}
        />
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm text-primary">
          <Shield className="h-4 w-4" />
          {t("membership.notCapital")}
        </div>
        {isLoading || !plan ? (
          <PanelBlockSkeleton height="h-64" />
        ) : (
          <div className="mx-auto max-w-lg">{pricingCard}</div>
        )}
      </PanelPage>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketingHeader />
      <PageHeroBanner
        eyebrow={t("membership.eyebrow")}
        title={t("membership.heroTitle")}
        height="md"
      />

      <ImageSplitSection
        imageSrc={THEMATIC_IMAGES.sections.membership}
        imageAlt="Investor membership and premium access"
        imagePosition="left"
        imageAspect="compact"
        compact
        className="bg-secondary/30"
      >
        <p className="text-sm text-muted-foreground">{t("membership.heroSub")}</p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm text-primary">
          <Shield className="h-4 w-4" />
          {t("membership.notCapital")}
        </div>
        <div className="mt-8">
        {isLoading || !plan ? (
          <p className="text-sm text-muted-foreground">{t("membership.loadingPlans")}</p>
        ) : (
          pricingCard
        )}
        </div>
      </ImageSplitSection>
      <MarketingFooter />
    </div>
  );
}
