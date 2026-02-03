"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Switch } from "@workspace/ui/components/switch";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { FlaskConical, Sparkles, Link2, PenTool, Check } from "lucide-react";

export function SettingsBetaProgram() {
  const [betaProgramEnabled, setBetaProgramEnabled] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleBetaToggle = (checked: boolean) => {
    if (checked) {
      // Show confirmation dialog when enabling
      setShowConfirmDialog(true);
    } else {
      // Disable immediately without confirmation
      setBetaProgramEnabled(false);
    }
  };

  const confirmJoinBeta = () => {
    setBetaProgramEnabled(true);
    setShowConfirmDialog(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Beta Program</CardTitle>
          </div>
          <CardDescription>Join our beta program to trial new features and help shape the future of SearchFit</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Beta Program Toggle */}
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Join Beta Program</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 max-w-md">
                Get early access to new features, exclusive insights, and help us improve SearchFit. 
                You'll receive invitations to test cutting-edge AI search optimization tools before general release.
              </p>
            </div>
            <Switch checked={betaProgramEnabled} onCheckedChange={handleBetaToggle} />
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Features Preview */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-lg">Coming Soon</CardTitle>
          </div>
          <CardDescription>Features currently in development</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                icon: Link2,
                title: "Backlink Exchange",
                description: "Connect with vetted partners to exchange high-quality backlinks and grow domain authority",
              },
              {
                icon: PenTool,
                title: "Custom Writing Profiles",
                description: "Create personalized writing styles and tones for your brand's content generation",
              },
            ].map((feature, i) => (
              <div key={i} className="p-4 rounded-lg border border-border bg-muted/30">
                <div className="flex items-center gap-3 mb-2">
                  <feature.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{feature.title}</span>
                </div>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Beta Program Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="text-center sm:text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <FlaskConical className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle>Join the Beta Program</DialogTitle>
            <DialogDescription className="pt-2">
              Welcome to the SearchFit Beta Program! Here's what you can expect:
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 py-4">
            {[
              "Early access to new features before public release",
              "Occasional email invitations to test new tools",
              "Direct feedback channel to shape product development",
              "Some features may be experimental or change",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-muted-foreground">{item}</span>
              </div>
            ))}
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-2">
            <Button onClick={confirmJoinBeta} className="w-full">
              <FlaskConical className="mr-2 h-4 w-4" />
              Join Beta Program
            </Button>
            <Button variant="ghost" onClick={() => setShowConfirmDialog(false)} className="w-full">
              Maybe later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
