"use client";

import Link from "next/link";
import { PlatformLogo } from "@/components/shared/platform-logo";
import { ROUTES } from "@/constants";
import { useI18n } from "@/hooks";

type AuthShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export function AuthShell({ children, title, subtitle }: AuthShellProps) {
  const { t } = useI18n();

  const stats = [
    { stat: "150+", label: t("landing.statsProjects") },
    { stat: "100%", label: t("landing.statsKyc") },
    { stat: "$12M+", label: t("landing.statsFunding") },
    { stat: "24/7", label: t("landing.statsMessaging") },
  ];

  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-[46%] max-w-2xl flex-col justify-between overflow-hidden cta-gradient lg:flex xl:w-[44%]">
        <div className="pointer-events-none absolute inset-0 dot-pattern opacity-[0.18]" aria-hidden />
        <div
          className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-white/[0.06] blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl"
          aria-hidden
        />
        <div className="relative z-10 flex h-full flex-col justify-between p-10 xl:p-12">
          <Link href={ROUTES.HOME}>
            <PlatformLogo theme="dark" />
          </Link>
          <div>
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
            <div className="mt-8 grid grid-cols-2 gap-2.5">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <p className="font-display text-lg font-semibold text-white">{item.stat}</p>
                  <p className="mt-0.5 text-xs text-white/60">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} {t("common.platformName")}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-background p-6 sm:p-8">
        <div className="w-full max-w-[400px] animate-slide-up">{children}</div>
      </div>
    </div>
  );
}
