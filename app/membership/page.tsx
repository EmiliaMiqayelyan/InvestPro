import { Suspense } from "react";
import MembershipPage from "./membership-content";

export default function MembershipRoute() {
  return (
    <Suspense fallback={<div className="p-6 text-sm text-muted-foreground">…</div>}>
      <MembershipPage />
    </Suspense>
  );
}
