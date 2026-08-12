"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";

export function ServicePaywall({ className }: { className?: string }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const membershipHref = pathname.startsWith("/investor")
    ? ROUTES.INVESTOR_MEMBERSHIP
    : ROUTES.MEMBERSHIP;

  return (
    <div className={className ?? "premium-card flex flex-col items-start gap-3 border-teal-100 bg-teal-50/50 p-5"}>
      <div className="flex items-center gap-2 text-teal-900">
        <Lock className="h-4 w-4" />
        <p className="font-display text-sm font-semibold">{t("membership.paywallTitle")}</p>
      </div>
      <p className="text-sm text-muted-foreground">{t("membership.paywallBody")}</p>
      <Button size="sm" asChild>
        <Link href={membershipHref}>{t("membership.paywallCta")}</Link>
      </Button>
    </div>
  );
}
