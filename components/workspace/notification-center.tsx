"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  CircleAlert,
  FileWarning,
  Handshake,
  Landmark,
  Mail,
  Milestone,
  Shield,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useI18n } from "@/hooks";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotificationStream,
  useNotifications,
} from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/utils/format";
import type { Notification, NotificationType } from "@/types";
import type { TranslationKey } from "@/i18n";

const TYPE_META: Record<
  NotificationType,
  { icon: React.ComponentType<{ className?: string }>; className: string; labelKey: TranslationKey }
> = {
  offer_received: {
    icon: Handshake,
    className: "bg-emerald-50 text-emerald-700",
    labelKey: "notifications.types.offer_received",
  },
  offer_updated: {
    icon: Handshake,
    className: "bg-teal-50 text-teal-800",
    labelKey: "notifications.types.offer_updated",
  },
  message: {
    icon: Mail,
    className: "bg-sky-50 text-sky-700",
    labelKey: "notifications.types.message",
  },
  membership: {
    icon: Landmark,
    className: "bg-amber-50 text-amber-700",
    labelKey: "notifications.types.membership",
  },
  kyc_update: {
    icon: Shield,
    className: "bg-indigo-50 text-indigo-700",
    labelKey: "notifications.types.kyc_update",
  },
  project_update: {
    icon: Sparkles,
    className: "bg-violet-50 text-violet-700",
    labelKey: "notifications.types.project_update",
  },
  security_alert: {
    icon: CircleAlert,
    className: "bg-red-50 text-red-700",
    labelKey: "notifications.types.security_alert",
  },
  milestone_update: {
    icon: Milestone,
    className: "bg-teal-50 text-teal-800",
    labelKey: "notifications.types.milestone_update",
  },
  complaint: {
    icon: FileWarning,
    className: "bg-orange-50 text-orange-700",
    labelKey: "notifications.types.complaint",
  },
  user_update: {
    icon: UserRound,
    className: "bg-slate-100 text-slate-700",
    labelKey: "notifications.types.user_update",
  },
  general: {
    icon: Bell,
    className: "bg-slate-100 text-slate-700",
    labelKey: "notifications.types.general",
  },
};

const PANEL_WIDTH = 360;
const PANEL_GAP = 8;
const VIEWPORT_PAD = 12;

export function NotificationCenter() {
  const { t } = useI18n();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: PANEL_WIDTH });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { data: items = [], isLoading } = useNotifications();
  useNotificationStream();
  const markRead = useMarkNotificationRead();
  const markAll = useMarkAllNotificationsRead();

  const unreadCount = useMemo(() => items.filter((item) => !item.isRead).length, [items]);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open) return;

    const place = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(PANEL_WIDTH, window.innerWidth - VIEWPORT_PAD * 2);
      const left = Math.min(
        Math.max(VIEWPORT_PAD, rect.right - width),
        window.innerWidth - width - VIEWPORT_PAD
      );
      setCoords({
        top: rect.bottom + PANEL_GAP,
        left,
        width,
      });
    };

    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const onOpenItem = (item: Notification) => {
    if (!item.isRead) markRead.mutate(item.id);
    setOpen(false);
    if (item.href) router.push(item.href);
  };

  const panel =
    open && mounted
      ? createPortal(
          <>
            <button
              type="button"
              aria-label={t("common.cancel")}
              className="fixed inset-0 z-[80] cursor-default bg-slate-900/15"
              onClick={() => setOpen(false)}
            />
            <div
              role="dialog"
              aria-label={t("notifications.title")}
              className="fixed z-[90] overflow-hidden rounded-2xl border border-border bg-white shadow-[0_16px_48px_rgba(15,23,42,0.16)]"
              style={{ top: coords.top, left: coords.left, width: coords.width }}
            >
              <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900">{t("notifications.title")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {unreadCount > 0
                      ? t("notifications.unreadCount", { count: unreadCount })
                      : t("notifications.allCaughtUp")}
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-auto shrink-0 px-2 py-1 text-xs leading-tight text-teal-800"
                  disabled={unreadCount === 0 || markAll.isPending}
                  onClick={() => markAll.mutate()}
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                  {t("notifications.markAllRead")}
                </Button>
              </div>

              <div className="max-h-[min(26rem,calc(100vh-8rem))] overflow-y-auto">
                {isLoading && (
                  <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                    {t("common.loading")}
                  </p>
                )}
                {!isLoading && items.length === 0 && (
                  <div className="px-4 py-10 text-center">
                    <Bell className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-medium text-slate-900">
                      {t("notifications.emptyTitle")}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{t("notifications.emptyBody")}</p>
                  </div>
                )}
                {items.map((item) => {
                  const meta = TYPE_META[item.type] || TYPE_META.general;
                  const Icon = meta.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onOpenItem(item)}
                      className={cn(
                        "flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition last:border-b-0 hover:bg-slate-50",
                        !item.isRead && "bg-teal-50/50"
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                          meta.className
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-start justify-between gap-2">
                          <span className="text-sm font-medium text-slate-900">{item.title}</span>
                          {!item.isRead && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-teal-700" />
                          )}
                        </span>
                        <span className="mt-0.5 line-clamp-2 text-xs text-slate-600">
                          {item.message}
                        </span>
                        <span className="mt-1.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{t(meta.labelKey)}</span>
                          <span>·</span>
                          <span>{formatRelativeTime(item.createdAt)}</span>
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </>,
          document.body
        )
      : null;

  return (
    <>
      <Button
        ref={buttonRef}
        type="button"
        variant="ghost"
        size="icon"
        className={cn("relative rounded-xl", open && "bg-teal-50 text-teal-800")}
        aria-label={t("notifications.title")}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-teal-700 px-1 text-[10px] font-semibold leading-none text-white ring-2 ring-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>
      {panel}
    </>
  );
}
