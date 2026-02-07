"use client"

import { useState, useRef, useTransition } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "motion/react"
import { Turnstile } from "@marsidev/react-turnstile"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Logo } from "@workspace/ui/components/logo"
import { Mail, ArrowRight, CheckCircle2, Loader2, Sparkles, PartyPopper } from "lucide-react"
import { env } from "@/env"
import { joinWaitlist } from "./actions"

export function WaitlistForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const turnstileRef = useRef<any>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!turnstileToken) {
      setError("Please complete the security check.")
      return
    }

    startTransition(async () => {
      const result = await joinWaitlist(email, turnstileToken)
      if (result.success) {
        setSubmitted(true)
      } else {
        setError(result.error)
        // Reset turnstile so user can retry
        turnstileRef.current?.reset()
        setTurnstileToken(null)
      }
    })
  }

  return (
    <div className="w-full max-w-md">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center rounded-3xl border border-border bg-card p-10 text-center shadow-lg"
          >
            {/* Animated icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.5, type: "spring", stiffness: 200, damping: 12 }}
              className="relative mb-6"
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950">
                <PartyPopper className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.3, type: "spring" }}
                className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <CheckCircle2 className="h-4 w-4" />
              </motion.div>
            </motion.div>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-2xl font-bold tracking-tight"
            >
              You&apos;re on the list!
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="mt-3 text-sm leading-relaxed text-muted-foreground"
            >
              We&apos;ll send an invite to{" "}
              <span className="font-medium text-foreground">{email}</span>{" "}
              when your spot is ready.
            </motion.p>

            {/* What happens next */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.4 }}
              className="mt-6 w-full space-y-3 rounded-2xl bg-muted/50 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What happens next
              </p>
              <div className="space-y-2.5">
                {[
                  "We'll review your application",
                  "You'll receive an invite email",
                  "Get early access with a special offer",
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-left">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <span className="text-sm text-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Highlight */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="mt-5 flex items-center gap-2 rounded-xl bg-primary/5 px-4 py-2.5"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-primary" />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Early adopters</span>{" "}
                get priority access and special pricing
              </p>
            </motion.div>

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="mt-8 flex w-full flex-col gap-3"
            >
              <Button className="w-full gap-2 rounded-xl" asChild>
                <Link href="/">
                  Explore SearchFit
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                Questions?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Contact us
                </Link>
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col rounded-3xl border border-border bg-card p-10 shadow-lg"
          >
            {/* Header */}
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-5">
                <Logo />
              </div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Join the waitlist
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we&apos;ll let you know when your spot is ready
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="space-y-2">
                <label htmlFor="waitlist-email" className="text-sm font-medium">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="waitlist-email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (error) setError(null)
                    }}
                    className="h-11 rounded-xl pl-10"
                    disabled={isPending}
                    autoComplete="email"
                  />
                </div>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-destructive"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              {/* Cloudflare Turnstile */}
              <div className="flex items-center justify-center py-1">
                <Turnstile
                  ref={turnstileRef}
                  siteKey={env.NEXT_PUBLIC_TURNSILE_SITE_KEY_CONTACT_FORM!}
                  onSuccess={(token) => setTurnstileToken(token)}
                  onError={() => {
                    setTurnstileToken(null)
                    setError("Security check failed. Please try again.")
                  }}
                  onExpire={() => {
                    setTurnstileToken(null)
                  }}
                  options={{
                    theme: "auto",
                    size: "normal",
                    appearance: "always",
                  }}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gap-2 rounded-xl"
                disabled={isPending || !email || !turnstileToken}
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    Join the waitlist
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have access?{" "}
              <Link
                href="/auth/sign-in"
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
