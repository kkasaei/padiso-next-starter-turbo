import { Suspense } from "react";
import { AnalyticsContent } from "@/components/workspace/analytics/AnalyticsContent";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
