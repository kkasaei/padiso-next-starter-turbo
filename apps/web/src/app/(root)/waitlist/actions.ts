"use server"

import { clerkClient } from "@clerk/nextjs/server"

type JoinWaitlistResult =
  | { success: true }
  | { success: false; error: string }

/**
 * Validate a Cloudflare Turnstile token server-side.
 */
async function verifyTurnstile(token: string): Promise<boolean> {
  const secret = process.env.TURNSILE_SECRET_KEY_CONTACT_FORM
  if (!secret) {
    console.warn("[waitlist] TURNSILE_SECRET_KEY_CONTACT_FORM not set — skipping verification")
    return true // allow in dev when key isn't configured
  }

  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ secret, response: token }),
  })

  const data = (await res.json()) as { success: boolean }
  return data.success
}

export async function joinWaitlist(
  email: string,
  turnstileToken: string
): Promise<JoinWaitlistResult> {
  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Please enter a valid email address." }
  }

  // Validate Turnstile
  if (!turnstileToken) {
    return { success: false, error: "Please complete the security check." }
  }

  const isHuman = await verifyTurnstile(turnstileToken)
  if (!isHuman) {
    return { success: false, error: "Security verification failed. Please try again." }
  }

  // Submit to Clerk waitlist
  try {
    const clerk = await clerkClient()
    await clerk.waitlistEntries.create({ emailAddress: email })
    return { success: true }
  } catch (err: unknown) {
    // Clerk returns specific error codes
    const clerkError = err as { errors?: { code?: string; message?: string }[] }
    const firstError = clerkError.errors?.[0]

    if (firstError?.code === "form_identifier_exists") {
      // Already on the waitlist — treat as success so the user feels good
      return { success: true }
    }

    console.error("[waitlist] Failed to join:", firstError?.message ?? err)
    return {
      success: false,
      error: "Something went wrong. Please try again.",
    }
  }
}
