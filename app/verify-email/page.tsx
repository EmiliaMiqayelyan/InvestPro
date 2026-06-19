import { Suspense } from "react";
import VerifyEmailContent from "./verify-email-content";
import { Skeleton } from "@/components/ui/skeleton";

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Skeleton className="h-64 w-full max-w-md" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
