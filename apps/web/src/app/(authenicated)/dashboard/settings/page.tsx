import { Suspense } from "react";
import { SettingsContent } from "@/components/workspace/settings/SettingsContent-v1";

export default function SettingsPage() {
  return (
    <Suspense fallback={null}>
      <SettingsContent />
    </Suspense>
  );
}
