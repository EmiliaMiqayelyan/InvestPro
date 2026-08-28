"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks";
import { useConversations, useMessages } from "@/hooks/use-marketplace";
import { chatApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { CONTACT_BLOCKED_PATTERNS, QUERY_KEYS } from "@/constants";
import { formatDate, formatRelativeTime } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function draftContainsContact(text: string): boolean {
  return CONTACT_BLOCKED_PATTERNS.some((pattern) => pattern.test(text));
}

export function MessagesPanel() {
  const { user } = useAuth();
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const { data: conversations = [], isLoading } = useConversations();
  const { data: messages = [] } = useMessages(selectedId);

  const selected = conversations.find((c) => c.id === selectedId);

  const sendMutation = useMutation({
    mutationFn: () => chatApi.sendMessage(selectedId!, { content: draft.trim() }),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MESSAGES, selectedId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const handleSend = () => {
    if (!draft.trim() || !selectedId) return;
    if (draftContainsContact(draft)) {
      toast.warning(t("messages.securityNote"));
    }
    sendMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{t("messages.securityNote")}</p>
      </div>

      <div className="premium-card grid min-h-[520px] overflow-hidden lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-border bg-slate-50/80 lg:border-b-0 lg:border-r">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">{t("messages.conversations")}</p>
          </div>
          <div className="max-h-[220px] overflow-y-auto lg:max-h-[480px]">
            {isLoading ? (
              <p className="p-4 text-sm text-muted-foreground">{t("common.loading")}</p>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-muted-foreground">
                <MessageSquare className="h-8 w-8 text-slate-300" />
                {t("messages.noConversations")}
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition hover:bg-white",
                    selectedId === c.id && "bg-white ring-inset ring-2 ring-teal-100"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-slate-900">
                      {c.projectTitle}
                    </span>
                    {c.unreadCount > 0 && (
                      <Badge className="bg-teal-700 text-white">{c.unreadCount}</Badge>
                    )}
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {c.isAdminThread
                      ? t("roles.admin")
                      : user?.role === "investor"
                        ? c.ownerName
                        : c.investorName}
                  </span>
                  {c.lastMessage && (
                    <span className="truncate text-xs text-slate-500">{c.lastMessage}</span>
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="flex min-h-[360px] flex-col bg-white">
          {selected ? (
            <>
              <div className="border-b border-border px-5 py-4">
                <p className="font-semibold text-slate-900">{selected.projectTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {user?.role === "investor" ? selected.ownerName : selected.investorName}
                  {selected.lastMessageAt
                    ? ` · ${formatRelativeTime(selected.lastMessageAt)}`
                    : ""}
                </p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.map((m) => {
                  const mine = m.senderId === user?.id;
                  const bubbleStyle =
                    m.senderRole === "investor"
                      ? "bg-gradient-to-r from-teal-900 to-teal-700 text-white"
                      : m.senderRole === "project_owner"
                        ? "bg-gradient-to-r from-amber-500 to-brand-gold text-white"
                        : mine
                          ? "bg-slate-700 text-white"
                          : "bg-slate-100 text-slate-800";
                  return (
                    <div
                      key={m.id}
                      className={cn("flex", mine ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm",
                          bubbleStyle
                        )}
                      >
                        <p className="mb-1 text-[11px] opacity-70">
                          {m.senderName} · {formatDate(m.createdAt, "MMM d, HH:mm")}
                        </p>
                        <p className="whitespace-pre-wrap">{m.content}</p>
                        {m.isFlagged && (
                          <Badge
                            variant="outline"
                            className="mt-2 border-red-200 bg-red-50 text-red-700"
                          >
                            {t("messages.flagged")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <form
                className="flex gap-2 border-t border-border p-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <Textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={t("messages.placeholder")}
                  className="min-h-[44px] resize-none"
                  rows={2}
                />
                <Button
                  type="submit"
                  className="shrink-0 bg-teal-700 hover:bg-teal-800"
                  disabled={sendMutation.isPending || !draft.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-muted-foreground">
              <MessageSquare className="h-10 w-10 text-slate-300" />
              <p className="text-sm">{t("messages.selectConversation")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
