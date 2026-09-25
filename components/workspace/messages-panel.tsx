"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Plus, Send, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useI18n } from "@/hooks";
import { useConversations, useMessages } from "@/hooks/use-marketplace";
import { adminMarketplaceApi, chatApi } from "@/services/api";
import { getErrorMessage } from "@/services/api/client";
import { CONTACT_BLOCKED_PATTERNS, QUERY_KEYS, ROUTES } from "@/constants";
import { formatDate, formatRelativeTime } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Conversation, User } from "@/types";

function draftContainsContact(text: string): boolean {
  return CONTACT_BLOCKED_PATTERNS.some((pattern) => pattern.test(text));
}

function peerLabel(
  c: Conversation,
  userId: string | undefined,
  role: string | undefined,
  t: (key: string) => string
) {
  if (role === "admin") {
    if (userId === c.investorId) return c.ownerName;
    if (userId === c.ownerId) return c.investorName;
    return c.ownerName || c.investorName;
  }
  if (c.isAdminThread) return t("roles.admin");
  if (role === "investor") return c.ownerName;
  return c.investorName;
}

export function MessagesPanel() {
  const { user } = useAuth();
  const { t, locale } = useI18n();
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const conversationFromUrl = searchParams.get("c");
  const userFromUrl = searchParams.get("user");
  const [selectedId, setSelectedId] = useState<string | null>(conversationFromUrl);
  const [draft, setDraft] = useState("");
  const [startOpen, setStartOpen] = useState(false);
  const [targetUserId, setTargetUserId] = useState("");

  const isAdmin = user?.role === "admin";
  const { data: conversations = [], isLoading } = useConversations();
  const { data: messages = [] } = useMessages(selectedId);

  const { data: usersData } = useQuery({
    queryKey: [QUERY_KEYS.ADMIN_USERS, "message-picker"],
    queryFn: async () =>
      (await adminMarketplaceApi.users({ limit: 100 })).data.data,
    enabled: isAdmin && startOpen,
  });

  const messageableUsers = useMemo(() => {
    const list = (usersData?.data ?? []) as User[];
    return list.filter((u) => u.role === "investor" || u.role === "project_owner");
  }, [usersData]);

  useEffect(() => {
    if (!conversationFromUrl) return;
    setSelectedId(conversationFromUrl);
  }, [conversationFromUrl]);

  useEffect(() => {
    if (!conversationFromUrl || conversations.length === 0) return;
    const exists = conversations.some((c) => c.id === conversationFromUrl);
    if (exists) setSelectedId(conversationFromUrl);
  }, [conversationFromUrl, conversations]);

  useEffect(() => {
    if (!isAdmin || !userFromUrl) return;
    setTargetUserId(userFromUrl);
    setStartOpen(true);
  }, [isAdmin, userFromUrl]);

  const selected = conversations.find((c) => c.id === selectedId);

  // Mark conversation + related notifications as seen when opened
  useEffect(() => {
    if (!selectedId) return;
    const conversation = conversations.find((c) => c.id === selectedId);
    const needsClear = (conversation?.unreadCount ?? 0) > 0;

    queryClient.setQueryData<Conversation[]>([QUERY_KEYS.CONVERSATIONS], (list) =>
      (list || []).map((c) => (c.id === selectedId ? { ...c, unreadCount: 0 } : c))
    );

    let cancelled = false;
    (async () => {
      try {
        await chatApi.markRead(selectedId);
        if (cancelled) return;
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTIFICATIONS] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.OWNER_DASHBOARD] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVESTOR_DASHBOARD] });
      } catch {
        if (!cancelled && needsClear) {
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedId, queryClient]);

  const sendMutation = useMutation({
    mutationFn: () => chatApi.sendMessage(selectedId!, { content: draft.trim() }),
    onSuccess: () => {
      setDraft("");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MESSAGES, selectedId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const startMutation = useMutation({
    mutationFn: (userId: string) => chatApi.start({ userId }),
    onSuccess: (res) => {
      const conversation = res.data.data;
      setStartOpen(false);
      setTargetUserId("");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CONVERSATIONS] });
      toast.success(t("messages.startedToast"));
      if (conversation?.id) {
        setSelectedId(conversation.id);
        router.replace(`${ROUTES.ADMIN_MESSAGES}?c=${conversation.id}`);
      }
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
      <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning-foreground">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <p>{t("messages.securityNote")}</p>
      </div>

      <Card className="grid min-h-[520px] overflow-hidden p-0 lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-border bg-muted/40 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              {t("messages.conversations")}
            </p>
            {isAdmin ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-8 gap-1 px-2"
                onClick={() => setStartOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                {t("messages.newConversation")}
              </Button>
            ) : null}
          </div>
          <div className="max-h-[220px] overflow-y-auto lg:max-h-[480px]">
            {isLoading ? (
              <p className="p-4 text-sm text-muted-foreground">{t("common.loading")}</p>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center gap-2 p-8 text-center text-sm text-muted-foreground">
                <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                <p className="font-medium text-foreground">{t("messages.emptyTitle")}</p>
                <p className="text-xs leading-relaxed">
                  {isAdmin ? t("messages.emptyBodyAdmin") : t("messages.emptyBody")}
                </p>
              </div>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedId(c.id)}
                  className={cn(
                    "flex w-full flex-col gap-1 border-b border-border px-4 py-3 text-left transition hover:bg-card",
                    selectedId === c.id && "bg-card ring-inset ring-2 ring-primary/20"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-medium text-foreground">
                      {c.projectTitle}
                    </span>
                    {c.unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground">
                        {c.unreadCount}
                      </Badge>
                    )}
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {peerLabel(c, user?.id, user?.role, t)}
                  </span>
                  {c.lastMessage && (
                    <span className="truncate text-xs text-muted-foreground">
                      {c.lastMessage}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="flex min-h-[360px] flex-col bg-card">
          {selected ? (
            <>
              <div className="border-b border-border px-5 py-4">
                <p className="font-semibold text-foreground">{selected.projectTitle}</p>
                <p className="text-xs text-muted-foreground">
                  {peerLabel(selected, user?.id, user?.role, t)}
                  {selected.lastMessageAt
                    ? ` · ${formatRelativeTime(selected.lastMessageAt, locale)}`
                    : ""}
                </p>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto p-5">
                {messages.map((m) => {
                  const mine = m.senderId === user?.id;
                  const bubbleStyle =
                    m.senderRole === "investor"
                      ? "bg-primary text-primary-foreground"
                      : m.senderRole === "project_owner"
                        ? "bg-warning text-warning-foreground"
                        : mine
                          ? "bg-foreground text-background"
                          : "bg-muted text-foreground";
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
                            className="mt-2 border-destructive/30 bg-destructive/10 text-destructive"
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
                  className="shrink-0"
                  disabled={sendMutation.isPending || !draft.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground">
              <MessageSquare className="h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm">{t("messages.selectConversation")}</p>
              {isAdmin ? (
                <Button type="button" variant="outline" onClick={() => setStartOpen(true)}>
                  <Plus className="h-4 w-4" />
                  {t("messages.newConversation")}
                </Button>
              ) : null}
            </div>
          )}
        </div>
      </Card>

      {isAdmin ? (
        <Dialog open={startOpen} onOpenChange={setStartOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("messages.newConversation")}</DialogTitle>
              <DialogDescription>{t("messages.newConversationBody")}</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Select value={targetUserId || undefined} onValueChange={setTargetUserId}>
                <SelectTrigger>
                  <SelectValue placeholder={t("messages.pickUser")} />
                </SelectTrigger>
                <SelectContent>
                  {messageableUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.firstName} {u.lastName} · {t(`roles.${u.role}` as "roles.investor")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStartOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button
                disabled={!targetUserId || startMutation.isPending}
                onClick={() => startMutation.mutate(targetUserId)}
              >
                {startMutation.isPending ? t("common.saving") : t("messages.startChatAction")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
