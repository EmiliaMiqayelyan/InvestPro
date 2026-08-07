"use client";

import { MessagesPanel } from "@/components/workspace/messages-panel";

export default function InvestorMessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-slate-900">Messages</h2>
        <p className="text-sm text-muted-foreground">
          Secure conversations with project owners
        </p>
      </div>
      <MessagesPanel />
    </div>
  );
}
