import { Suspense } from "react";
import { PromptsContent } from "@/components/workspace/prompts/prompts-content";

export default function PromptsPage() {
  return (
    <Suspense fallback={null}>
      <PromptsContent />
    </Suspense>
  );
}
