"use client";

import Link from "next/link";
import { Check, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";
import type { TranslationKey } from "@/i18n";

const FEATURE_KEYS = [
  "membership.featureFullMaterials",
  "membership.featureDocsTeamFinance",
  "membership.featureMessaging",
  "membership.featureOffers",
] as const satisfies readonly TranslationKey[];

export function ServicePaywall({ className }: { className?: string }) {
  const { t } = useI18n();

  return (
    <div className={className ?? "surface-card border-primary/20 bg-primary/5 p-6"}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
          <Lock className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display font-semibold">{t("membership.paywallTitle")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("membership.paywallBody")}</p>
          <ul className="mt-4 space-y-2">
            {FEATURE_KEYS.map((key) => (
              <li key={key} className="flex items-center gap-2 text-sm">
                <Check className="h-3.5 w-3.5 text-primary" />
                {t(key)}
              </li>
            ))}
          </ul>
          <Button size="sm" className="mt-4" asChild>
            <Link href={ROUTES.INVESTOR_MEMBERSHIP}>{t("membership.paywallCta")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
