import { Suspense } from "react";
import { PromptsContent } from "@/components/workspace/prompts/PromptsContent";

export default function PromptsPage() {
  return (
    <Suspense fallback={null}>
      <PromptsContent />
    </Suspense>
  );
}
