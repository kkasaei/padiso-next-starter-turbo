"use client";

import Link from "next/link";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@workspace/ui/components/tooltip";
import { LogoIcon } from "@/components/brands/LogoIcon";
import { UserMenu } from "@/components/layout/UserMenu";
import { LifeBuoyIcon, Gift } from "lucide-react";

function WorkspacesSidebar() {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="sticky top-0 flex h-screen w-20 flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center justify-center p-4">
          <Link href="/">
            <LogoIcon size="md" />
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Docs & Referral */}
        <div className="flex flex-col items-center gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/docs"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
              >
                <LifeBuoyIcon className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              Docs
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/profile/referral"
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground transition-colors"
              >
                <Gift className="h-5 w-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={12}>
              Referral
            </TooltipContent>
          </Tooltip>
        </div>

        {/* User Avatar */}
        <div className="flex items-center justify-center p-4">
          <UserMenu variant="compact" />
        </div>
      </div>
    </TooltipProvider>
  );
}

export default function WorkspacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen bg-[#F2F2F4]">
          {/* Minimal Sidebar */}
          <WorkspacesSidebar />

          {/* Main content area */}
          <div className="relative flex flex-1 m-2">
            <main className="flex flex-1 rounded-2xl border border-border bg-background overflow-hidden">
              <div className="flex flex-1 flex-col min-w-0">{children}</div>
            </main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
