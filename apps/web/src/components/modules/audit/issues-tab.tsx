'use client';

import {
  XCircle,
  AlertTriangle,
  Info,
  CheckCircle,
  Lightbulb,
} from 'lucide-react';
import { Badge } from '@workspace/ui/components/badge';
import type { PageIssue } from './types';

// ============================================================
// HELPERS
// ============================================================
function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'critical':
      return <XCircle className="h-5 w-5 text-red-500 shrink-0" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500 shrink-0" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500 shrink-0" />;
    default:
      return <Info className="h-5 w-5 text-gray-400 shrink-0" />;
  }
}

function getSeverityBadge(severity: string) {
  switch (severity) {
    case 'critical':
      return <Badge variant="destructive">Critical</Badge>;
    case 'warning':
      return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Warning</Badge>;
    case 'info':
      return <Badge variant="secondary">Info</Badge>;
    default:
      return <Badge variant="outline">{severity}</Badge>;
  }
}

function getIssueTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    missing_title: 'Missing Title',
    missing_description: 'Missing Description',
    missing_h1: 'Missing H1',
    multiple_h1: 'Multiple H1 Tags',
    missing_alt_text: 'Missing Alt Text',
    broken_link: 'Broken Link',
    missing_canonical: 'Missing Canonical',
    missing_og_tags: 'Missing OG Tags',
    missing_structured_data: 'Missing Structured Data',
    duplicate_content: 'Duplicate Content',
    thin_content: 'Thin Content',
    slow_loading: 'Slow Loading',
    mobile_unfriendly: 'Mobile Unfriendly',
    missing_viewport: 'Missing Viewport',
    blocked_by_robots: 'Blocked by Robots',
    redirect_chain: 'Redirect Chain',
    mixed_content: 'Mixed Content',
    missing_lang: 'Missing Language',
    other: 'Other',
  };
  return labels[type] || type;
}

// ============================================================
// ISSUES TAB CONTENT
// ============================================================
interface IssuesTabContentProps {
  issues: PageIssue[];
}

export function IssuesTabContent({ issues }: IssuesTabContentProps) {
  if (issues.length === 0) {
    return (
      <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
        <div className="flex w-full flex-col items-center justify-center rounded-3xl bg-card p-12">
          <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-lg font-medium">No Issues Found</h3>
          <p className="text-sm text-muted-foreground mt-2 text-center max-w-md">
            This page passed all our checks. Great job maintaining high-quality standards!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex w-full flex-col justify-between rounded-xl bg-muted/30 p-2 lg:rounded-3xl">
      <div className="flex w-full flex-col rounded-3xl bg-card divide-y divide-border">
        {issues.map((issue, index) => (
          <div key={index} className="p-6">
            <div className="flex items-start gap-4">
              {getSeverityIcon(issue.severity)}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium">
                    {getIssueTypeLabel(issue.type)}
                  </span>
                  {getSeverityBadge(issue.severity)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {issue.message}
                </p>
                {issue.fix && (
                  <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-900/50">
                    <Lightbulb className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-medium text-green-700 dark:text-green-400 uppercase tracking-wide">
                        How to fix
                      </span>
                      <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                        {issue.fix}
                      </p>
                    </div>
                  </div>
                )}
                {issue.element && (
                  <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                    {issue.element}
                  </code>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

