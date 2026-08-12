import { Suspense } from "react";
import MembershipPage from "@/app/membership/membership-content";

export default function InvestorMembershipRoute() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">…</div>}>
      <MembershipPage />
    </Suspense>
  );
}
