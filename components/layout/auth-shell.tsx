"use client";

import Link from "next/link";
import { PlatformLogo } from "@/components/shared/platform-logo";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";

type AuthHighlight = {
  title: string;
  body: string;
};

type AuthShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  highlightsTitle?: string;
  highlights?: AuthHighlight[];
};

export function AuthShell({
  children,
  title,
  subtitle,
  highlightsTitle,
  highlights,
}: AuthShellProps) {
  const { t } = useI18n();

  const defaultHighlights = [
    { title: t("landing.heroFeature1"), body: t("landing.statsProjects") },
    { title: t("landing.heroFeature2"), body: t("landing.statsKyc") },
    { title: t("landing.heroFeature3"), body: t("landing.statsMessaging") },
    { title: t("landing.heroFeature4"), body: t("landing.statsFunding") },
  ];
  const panelHighlights = highlights && highlights.length > 0 ? highlights : defaultHighlights;

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden min-h-screen w-[46%] max-w-2xl flex-col overflow-hidden cta-gradient lg:flex xl:w-[44%]">
        <div className="pointer-events-none absolute inset-0 dot-pattern opacity-[0.18]" aria-hidden />
        <div
          className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
          aria-hidden
        />
        <div className="relative z-10 flex min-h-full flex-1 flex-col justify-between overflow-y-auto p-10 xl:p-12">
          <Link href={ROUTES.HOME}>
            <PlatformLogo theme="dark" />
          </Link>
          <div className="py-8">
            {title && (
              <>
                <h1 className="max-w-lg font-display text-3xl font-semibold leading-tight text-white xl:max-w-xl xl:text-[2rem]">
                  {title}
                </h1>
                {subtitle && (
                  <p className="mt-3 max-w-lg text-base leading-relaxed text-white/70 xl:max-w-xl">
                    {subtitle}
                  </p>
                )}
              </>
            )}
            <div className="mt-6">
              {highlightsTitle && (
                <p className="text-xs font-medium uppercase tracking-wider text-white/55">
                  {highlightsTitle}
                </p>
              )}
              <div className="mt-3 grid gap-2.5">
                {panelHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 backdrop-blur-sm"
                  >
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {t("common.platformName")}
          </p>
        </div>
      </div>

      <div className="flex min-h-screen flex-1 overflow-y-auto bg-background">
        <div className="m-auto w-full max-w-[480px] px-6 py-8 sm:px-8">
          <div className="animate-slide-up">{children}</div>
        </div>
      </div>
    </div>
  );
}
