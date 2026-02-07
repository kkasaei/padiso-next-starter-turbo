export const FEATURE_FLAGS = {
  ENABLE_ASK_AI: false,
  IS_WAITLIST: process.env.NEXT_PUBLIC_FLAG_IS_WAITLIST === "true", // env-driven: set NEXT_PUBLIC_FLAG_IS_WAITLIST="true" to enable waitlist mode
} as const;
