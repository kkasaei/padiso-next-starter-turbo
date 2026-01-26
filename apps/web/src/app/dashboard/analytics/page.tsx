import { Suspense } from "react";
import { AnalyticsContent } from "@/components/analytics/analytics-content";

export default function AnalyticsPage() {
  return (
    <Suspense fallback={null}>
      <AnalyticsContent />
    </Suspense>
  );
}
