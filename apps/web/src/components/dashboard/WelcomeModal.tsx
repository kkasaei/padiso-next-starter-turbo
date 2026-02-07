"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "motion/react";
import { Button } from "@workspace/ui/components/button";
import { Rocket, ArrowRight, X } from "lucide-react";

interface WelcomeModalProps {
  onSetupBrand: () => void;
  onDismiss: () => void;
}

export function WelcomeModal({ onSetupBrand, onDismiss }: WelcomeModalProps) {
  const { user } = useUser();
  const firstName = user?.firstName || "there";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative my-auto w-full max-w-md shrink-0 overflow-hidden rounded-[24px] bg-background shadow-2xl"
      >
        {/* Close button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10 h-8 w-8 rounded-full"
            onClick={onDismiss}
          >
            <X className="h-4 w-4" />
          </Button>
        </motion.div>

        {/* Content */}
        <div className="flex flex-col items-center px-8 pb-8 pt-10 text-center">
          {/* Animated icon with glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="relative mb-6"
          >
            {/* Pulse ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-primary/20"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ delay: 0.5, duration: 0.6, ease: "easeInOut" }}
              >
                <Rocket className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
          </motion.div>

          {/* Greeting - stagger in */}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-2xl font-semibold tracking-tight"
          >
            Welcome, {firstName}!
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="mt-3 max-w-[340px] text-sm leading-relaxed text-muted-foreground"
          >
            You&apos;re all set up. Let&apos;s create your first brand so you can start
            tracking your AI visibility across ChatGPT, Perplexity, Claude, and more.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-8 w-full"
          >
            <Button
              size="lg"
              className="w-full gap-2"
              onClick={onSetupBrand}
            >
              Set up your brand
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ delay: 1.2, duration: 0.8, repeat: Infinity, repeatDelay: 2 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.span>
            </Button>
          </motion.div>

          {/* Skip */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-3 text-sm text-muted-foreground transition-colors hover:text-foreground"
            onClick={onDismiss}
          >
            I&apos;ll do this later
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
