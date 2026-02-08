import { getWaitlistMode } from "@/lib/get-waitlist-mode";
import { CTAClient } from "./CTA.client";

export async function CTA() {
  const isWaitlistMode = await getWaitlistMode();
  return <CTAClient isWaitlistMode={isWaitlistMode} />;
}
