'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Lightbulb,
  Search,
  PanelLeftClose,
  ChevronRight,
  Globe,
  Bot,
  FileText,
  Settings,
  Zap,
  Target,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import { cn } from '@workspace/common/lib';
import type { PageAuditDto, PageIssue } from './types';

// ============================================================
// TYPES
// ============================================================
export type AnalysisTab = 'overview' | 'issues' | 'insights';

interface IssuesListPanelProps {
  pageAudit: PageAuditDto;
  onCollapse: () => void;
  onIssueSelect?: (issue: PageIssue | null) => void;
  selectedIssueIndex?: number | null;
  activeTab?: AnalysisTab;
  onTabChange?: (tab: AnalysisTab) => void;
}

// ============================================================
// SCORE CARD - Beautiful card style from analytics
// ============================================================
function ScoreCard({
  label,
  score,
  icon: Icon
}: {
  label: string;
  score: number | null;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const displayScore = score ?? 0;
  const getScoreColor = () => {
    if (displayScore >= 80) return 'text-green-600 dark:text-green-400';
    if (displayScore >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };
  const getBarColor = () => {
    if (displayScore >= 80) return 'bg-green-500';
    if (displayScore >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };
  const getStatus = () => {
    if (displayScore >= 80) return 'Good';
    if (displayScore >= 60) return 'Needs Work';
    return 'Critical';
  };

  return (
    <div className="flex flex-col justify-between rounded-xl bg-muted/30 p-1.5">
      <div className="flex flex-col gap-y-1 p-2 pb-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">{label}</span>
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <div className={cn('text-2xl font-light tabular-nums', getScoreColor())}>
          {score ?? '—'}
        </div>
      </div>
      <div className="rounded-lg bg-card p-2">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-muted-foreground">{getStatus()}</span>
          <span className={cn('text-[10px] font-medium tabular-nums', getScoreColor())}>
            {displayScore}%
          </span>
        </div>
        <div className="h-1 bg-muted rounded-full overflow-hidden">
          <div
            className={cn('h-full rounded-full transition-all duration-500', getBarColor())}
            style={{ width: `${displayScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ISSUE ITEM
// ============================================================
function IssueItem({
  issue,
  isSelected,
  onSelect,
}: {
  issue: PageIssue;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const severityConfig = {
    critical: {
      border: 'border-l-red-500',
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      label: 'Critical',
      labelColor: 'text-red-600 dark:text-red-400',
    },
    warning: {
      border: 'border-l-amber-500',
      icon: AlertCircle,
      iconColor: 'text-amber-500',
      label: 'Warning',
      labelColor: 'text-amber-600 dark:text-amber-400',
    },
    info: {
      border: 'border-l-blue-500',
      icon: Info,
      iconColor: 'text-blue-500',
      label: 'Info',
      labelColor: 'text-blue-600 dark:text-blue-400',
    },
  };
  const config = severityConfig[issue.severity as keyof typeof severityConfig];

  const Icon = config.icon;

  return (
    <button
      onClick={onSelect}
      className={cn(
        'group flex items-start gap-3 p-3 text-left transition-colors w-full border-l-2',
        config.border,
        isSelected ? 'bg-muted/50' : 'hover:bg-muted/30'
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0 mt-0.5', config.iconColor)} />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug line-clamp-2">
          {issue.message}
        </p>
        <span className={cn('text-xs mt-1 block', config.labelColor)}>
          {config.label}
        </span>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

// ============================================================
// STRENGTH ITEM
// ============================================================
function StrengthItem({ strength }: { strength: { title: string; description: string; impact?: string } }) {
  return (
    <div className="flex items-start gap-3 p-3 text-left w-full border-l-2 border-l-green-500">
      <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">{strength.title}</p>
        <span className="text-xs text-muted-foreground mt-1 block line-clamp-1">
          {strength.description}
        </span>
      </div>
    </div>
  );
}

// ============================================================
// RECOMMENDATION ITEM
// ============================================================
function RecommendationItem({ rec, onSelect }: {
  rec: { title: string; description: string; impact?: string };
  onSelect: () => void;
}) {
  const impactColors: Record<string, string> = {
    high: 'text-red-600 dark:text-red-400',
    medium: 'text-amber-600 dark:text-amber-400',
    low: 'text-blue-600 dark:text-blue-400',
  };
  const impactColor = (rec.impact && impactColors[rec.impact]) || 'text-muted-foreground';

  return (
    <button
      onClick={onSelect}
      className="group flex items-start gap-3 p-3 text-left transition-colors w-full border-l-2 border-l-amber-500 hover:bg-muted/30"
    >
      <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug">{rec.title}</p>
        <span className={cn('text-xs mt-1 block capitalize', impactColor)}>
          {rec.impact} impact
        </span>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function IssuesListPanel({
  pageAudit,
  onCollapse,
  onIssueSelect,
  selectedIssueIndex,
  activeTab: controlledTab,
  onTabChange,
}: IssuesListPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalTab, setInternalTab] = useState<AnalysisTab>('overview');

  // Support both controlled and uncontrolled modes
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: AnalysisTab) => {
    setInternalTab(tab);
    onTabChange?.(tab);
  };

  const issues = pageAudit.issues || [];
  const analysis = pageAudit.analysis;

  // Filter issues by search
  const filteredIssues = issues.filter((issue) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      issue.message.toLowerCase().includes(query) ||
      issue.type.toLowerCase().includes(query) ||
      issue.fix?.toLowerCase().includes(query)
    );
  });

  // Filter recommendations by search
  const filteredRecs = (analysis?.recommendations || []).filter((rec) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      rec.title.toLowerCase().includes(query) ||
      rec.description.toLowerCase().includes(query)
    );
  });

  const criticalCount = issues.filter(i => i.severity === 'critical').length;
  const warningCount = issues.filter(i => i.severity === 'warning').length;
  const infoCount = issues.filter(i => i.severity === 'info').length;

  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div className="relative h-full w-full rounded-2xl border border-gray-200 dark:border-polar-800 bg-white dark:bg-polar-900 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex h-12 items-center justify-between px-4 border-b border-gray-200 dark:border-polar-800 bg-white dark:bg-polar-900">
        <span className="font-medium text-sm">Analysis</span>
        <button
          onClick={onCollapse}
          className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <PanelLeftClose className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="absolute top-12 left-0 right-0 z-10 px-2 py-1.5 border-b border-gray-200 dark:border-polar-800 bg-white dark:bg-polar-900">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AnalysisTab)}>
          <TabsList className="bg-muted/50 h-8 p-0.5 rounded-lg w-full grid grid-cols-3">
            <TabsTrigger
              value="overview"
              className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-polar-800 data-[state=active]:shadow-sm"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="issues"
              className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-polar-800 data-[state=active]:shadow-sm"
            >
              Issues ({issues.length})
            </TabsTrigger>
            <TabsTrigger
              value="insights"
              className="text-xs rounded-md data-[state=active]:bg-white data-[state=active]:dark:bg-polar-800 data-[state=active]:shadow-sm"
            >
              Insights
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Search - Only for Issues/Insights */}
      {activeTab !== 'overview' && (
        <div className="absolute top-[84px] left-0 right-0 z-10 px-3 py-2 bg-white dark:bg-polar-900 border-b border-gray-200 dark:border-polar-800">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-gray-200 dark:border-polar-700 bg-muted/30 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary transition-all"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 overflow-y-auto",
        activeTab === 'overview' ? 'top-[84px]' : 'top-[132px]'
      )}>
        {/* ============== OVERVIEW TAB ============== */}
        {activeTab === 'overview' && (
          <div className="p-3 space-y-3">
            {/* Overall Score - Hero Card */}
            <div className="flex flex-col justify-between rounded-xl bg-muted/30 p-2">
              <div className="flex items-center justify-between p-3 pb-2">
                <div>
                  <span className="text-xs text-muted-foreground">Overall Score</span>
                  <div className={cn('text-4xl font-light tabular-nums mt-1', getScoreColor(pageAudit.overallScore))}>
                    {pageAudit.overallScore ?? '—'}
                  </div>
                </div>
                <div className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-full',
                  (pageAudit.overallScore ?? 0) >= 80 ? 'bg-green-100 dark:bg-green-900/30' :
                  (pageAudit.overallScore ?? 0) >= 60 ? 'bg-amber-100 dark:bg-amber-900/30' :
                  'bg-red-100 dark:bg-red-900/30'
                )}>
                  <Target className={cn(
                    'h-6 w-6',
                    (pageAudit.overallScore ?? 0) >= 80 ? 'text-green-600 dark:text-green-400' :
                    (pageAudit.overallScore ?? 0) >= 60 ? 'text-amber-600 dark:text-amber-400' :
                    'text-red-600 dark:text-red-400'
                  )} />
                </div>
              </div>
              {/* Issues Summary Row */}
              <div className="grid grid-cols-3 gap-1.5 rounded-lg bg-card p-2">
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveTab('issues')}>
                  <div className={cn('h-2 w-2 rounded-full', criticalCount > 0 ? 'bg-red-500' : 'bg-muted')} />
                  <div>
                    <div className={cn('text-sm font-medium tabular-nums', criticalCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground')}>
                      {criticalCount}
                    </div>
                    <div className="text-[9px] text-muted-foreground">Critical</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveTab('issues')}>
                  <div className={cn('h-2 w-2 rounded-full', warningCount > 0 ? 'bg-amber-500' : 'bg-muted')} />
                  <div>
                    <div className={cn('text-sm font-medium tabular-nums', warningCount > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-muted-foreground')}>
                      {warningCount}
                    </div>
                    <div className="text-[9px] text-muted-foreground">Warnings</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setActiveTab('issues')}>
                  <div className={cn('h-2 w-2 rounded-full', infoCount > 0 ? 'bg-blue-500' : 'bg-muted')} />
                  <div>
                    <div className={cn('text-sm font-medium tabular-nums', infoCount > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground')}>
                      {infoCount}
                    </div>
                    <div className="text-[9px] text-muted-foreground">Info</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Score Cards Grid */}
            <div className="grid grid-cols-2 gap-2">
              <ScoreCard label="SEO" score={pageAudit.seoScore} icon={Globe} />
              <ScoreCard label="AEO" score={pageAudit.aeoScore} icon={Bot} />
              <ScoreCard label="Content" score={pageAudit.contentScore} icon={FileText} />
              <ScoreCard label="Technical" score={pageAudit.technicalScore} icon={Settings} />
            </div>

            {/* AEO Readiness Card */}
            {analysis?.aeoReadiness && (
              <div className="flex flex-col justify-between rounded-xl bg-muted/30 p-2">
                <div className="flex items-center justify-between p-3 pb-2">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="text-xs font-medium">AEO Readiness</span>
                  </div>
                  <span className={cn(
                    "text-lg font-light tabular-nums",
                    analysis.aeoReadiness.score >= 70 ? 'text-green-600 dark:text-green-400' :
                    analysis.aeoReadiness.score >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                  )}>
                    {analysis.aeoReadiness.score}%
                  </span>
                </div>
                <div className="rounded-lg bg-card p-3 space-y-2">
                  {Object.entries(analysis.aeoReadiness.factors).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground w-20 shrink-0 truncate capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            'h-full rounded-full transition-all duration-500',
                            value >= 70 ? 'bg-green-500' : value >= 50 ? 'bg-amber-500' : 'bg-red-500'
                          )}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                      <span className={cn(
                        'text-[10px] font-medium tabular-nums w-6 text-right',
                        value >= 70 ? 'text-green-600 dark:text-green-400' : value >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                      )}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strengths Card */}
            {analysis?.strengths && analysis.strengths.length > 0 && (
              <div className="flex flex-col justify-between rounded-xl bg-muted/30 p-2">
                <div className="flex items-center justify-between p-3 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-medium">Strengths</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{analysis.strengths.length} found</span>
                </div>
                <div className="rounded-lg bg-card p-2 space-y-1">
                  {analysis.strengths.slice(0, 3).map((strength, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-muted/50 transition-colors">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                      <span className="text-xs truncate">{strength.title}</span>
                    </div>
                  ))}
                  {analysis.strengths.length > 3 && (
                    <button
                      onClick={() => setActiveTab('insights')}
                      className="w-full text-[11px] text-primary hover:underline text-center py-1"
                    >
                      View all {analysis.strengths.length} strengths →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============== ISSUES TAB ============== */}
        {activeTab === 'issues' && (
          <div className="divide-y divide-gray-100 dark:divide-polar-800">
            {filteredIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                {issues.length === 0 ? (
                  <>
                    <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                    <p className="text-sm font-medium">No issues found</p>
                    <p className="text-xs text-muted-foreground mt-1">This page looks great.</p>
                  </>
                ) : (
                  <>
                    <Search className="h-6 w-6 text-muted-foreground mb-2" />
                    <p className="text-sm">No matches</p>
                    <button onClick={() => setSearchQuery('')} className="text-xs text-primary hover:underline mt-2">
                      Clear search
                    </button>
                  </>
                )}
              </div>
            ) : (
              filteredIssues.map((issue, idx) => (
                <IssueItem
                  key={idx}
                  issue={issue}
                  isSelected={selectedIssueIndex === idx}
                  onSelect={() => onIssueSelect?.(issue)}
                />
              ))
            )}
          </div>
        )}

        {/* ============== INSIGHTS TAB ============== */}
        {activeTab === 'insights' && (
          <div className="divide-y divide-gray-100 dark:divide-polar-800">
            {/* Strengths */}
            {analysis?.strengths && analysis.strengths.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground">
                    Strengths ({analysis.strengths.length})
                  </span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-polar-800">
                  {analysis.strengths.map((strength, idx) => (
                    <StrengthItem key={idx} strength={strength} />
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis?.recommendations && analysis.recommendations.length > 0 && (
              <div>
                <div className="px-4 py-2 bg-muted/30">
                  <span className="text-xs font-medium text-muted-foreground">
                    Recommendations ({filteredRecs.length})
                  </span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-polar-800">
                  {filteredRecs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 px-4">
                      <Search className="h-5 w-5 text-muted-foreground mb-2" />
                      <p className="text-xs text-muted-foreground">No matches</p>
                    </div>
                  ) : (
                    filteredRecs.map((rec, idx) => (
                      <RecommendationItem key={idx} rec={rec} onSelect={() => {}} />
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Empty state */}
            {(!analysis?.strengths?.length && !analysis?.recommendations?.length) && (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <Lightbulb className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-sm">No insights yet</p>
                <p className="text-xs text-muted-foreground mt-1">Analysis insights will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
