'use client';

import { useState, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import {
  Bot,
  PanelRightClose,
  Sparkles,
  CopyIcon,
  RefreshCcwIcon,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
  Wand2,
  FileEdit,
} from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { Badge } from '@workspace/ui/components/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs';
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from '@workspace/ui/components/ai-elements/prompt-input';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from '@workspace/ui/components/ai-elements/conversation';
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
} from '@workspace/ui/components/ai-elements/message';
import { Loader } from '@workspace/ui/components/ai-elements/loader';
import { toast } from 'sonner';
import { cn } from '@workspace/common/lib';
import type { PageAuditDto, PageIssue } from './types';

// ============================================================
// TYPES
// ============================================================
interface AuditAnalysisPanelProps {
  pageAudit: PageAuditDto;
  onCollapse: () => void;
  selectedSection?: {
    id: string;
    type: string;
    content: string;
    issues?: PageIssue[];
    suggestion?: string;
  } | null;
  onRewriteApply?: (newContent: string) => void;
}

// ============================================================
// SEVERITY CONFIG
// ============================================================
const severityConfig = {
  critical: {
    bgClass: 'bg-red-50 dark:bg-red-950/30',
    textClass: 'text-red-600 dark:text-red-400',
    icon: AlertTriangle,
    label: 'Critical',
  },
  warning: {
    bgClass: 'bg-amber-50 dark:bg-amber-950/30',
    textClass: 'text-amber-600 dark:text-amber-400',
    icon: AlertCircle,
    label: 'Warning',
  },
  info: {
    bgClass: 'bg-blue-50 dark:bg-blue-950/30',
    textClass: 'text-blue-600 dark:text-blue-400',
    icon: Info,
    label: 'Info',
  },
};

// ============================================================
// ISSUE CARD COMPONENT
// ============================================================
function IssueCard({ issue, onFix }: { issue: PageIssue; onFix?: () => void }) {
  const config = severityConfig[issue.severity as keyof typeof severityConfig];
  const Icon = config.icon;

  return (
    <div className={cn('rounded-xl p-4 space-y-3', config.bgClass)}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <Icon className={cn('h-4 w-4 shrink-0 mt-0.5', config.textClass)} />
          <div className="min-w-0">
            <p className="text-sm font-medium">{issue.message}</p>
            {issue.fix && (
              <p className="text-xs text-muted-foreground mt-1">{issue.fix}</p>
            )}
          </div>
        </div>
        <Badge variant="outline" className={cn('shrink-0 text-xs', config.textClass)}>
          {config.label}
        </Badge>
      </div>
      {onFix && (
        <Button
          variant="outline"
          size="sm"
          onClick={onFix}
          className="w-full"
        >
          <Wand2 className="h-3.5 w-3.5 mr-1.5" />
          AI Fix This Issue
        </Button>
      )}
    </div>
  );
}

// ============================================================
// RECOMMENDATION CARD COMPONENT
// ============================================================
function RecommendationCard({
  rec
}: {
  rec: { title: string; description: string; impact?: string }
}) {
  const impactColor = rec.impact === 'high'
    ? 'text-red-500'
    : rec.impact === 'medium'
    ? 'text-amber-500'
    : 'text-blue-500';

  return (
    <div className="rounded-xl border border-gray-200 dark:border-polar-700 p-4 space-y-2 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <Lightbulb className="h-4 w-4 shrink-0 mt-0.5 text-amber-500" />
          <span className="text-sm font-medium">{rec.title}</span>
        </div>
        <Badge variant="outline" className={cn('shrink-0 text-xs capitalize', impactColor)}>
          {rec.impact}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground pl-6">{rec.description}</p>
    </div>
  );
}

// ============================================================
// STRENGTH CARD COMPONENT
// ============================================================
function StrengthCard({
  strength
}: {
  strength: { title: string; description: string; impact?: string }
}) {
  return (
    <div className="rounded-xl bg-green-50 dark:bg-green-950/30 p-4 space-y-2">
      <div className="flex items-start gap-2">
        <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-green-500" />
        <span className="text-sm font-medium text-green-700 dark:text-green-300">{strength.title}</span>
      </div>
      <p className="text-xs text-muted-foreground pl-6">{strength.description}</p>
    </div>
  );
}

// ============================================================
// SELECTED SECTION PANEL
// ============================================================
function SelectedSectionPanel({
  section,
  onAIRewrite,
  isRewriting,
}: {
  section: {
    id: string;
    type: string;
    content: string;
    issues?: PageIssue[];
    suggestion?: string;
  };
  onAIRewrite: () => void;
  isRewriting: boolean;
}) {
  return (
    <div className="rounded-xl border-2 border-primary/50 bg-primary/5 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileEdit className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Selected Content</span>
        </div>
        <Badge variant="outline" className="text-xs font-mono">
          {section.type}
        </Badge>
      </div>

      <div className="bg-white dark:bg-polar-900 rounded-lg p-3 border border-gray-200 dark:border-polar-700">
        <p className="text-sm break-all">{section.content || <span className="text-muted-foreground italic">Empty</span>}</p>
      </div>

      {section.issues && section.issues.length > 0 && (
        <div className="space-y-2">
          <span className="text-xs font-medium text-muted-foreground">Issues Found:</span>
          {section.issues.map((issue, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-start gap-2 text-xs rounded-lg p-2',
                severityConfig[issue.severity as keyof typeof severityConfig].bgClass
              )}
            >
              {(() => {
                const Icon = severityConfig[issue.severity as keyof typeof severityConfig].icon;
                return <Icon className={cn('h-3 w-3 shrink-0 mt-0.5', severityConfig[issue.severity as keyof typeof severityConfig].textClass)} />;
              })()}
              <span>{issue.message}</span>
            </div>
          ))}
        </div>
      )}

      {section.suggestion && (
        <div className="flex items-start gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg p-2">
          <Sparkles className="h-3 w-3 shrink-0 mt-0.5" />
          <span>{section.suggestion}</span>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={onAIRewrite}
          disabled={isRewriting}
          className="flex-1"
        >
          {isRewriting ? (
            <>
              <RefreshCcwIcon className="h-4 w-4 mr-1.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-1.5" />
              AI Rewrite
            </>
          )}
        </Button>
        <Button variant="outline" onClick={onAIRewrite} disabled={isRewriting}>
          <Wand2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function AuditAnalysisPanel({
  pageAudit,
  onCollapse,
  selectedSection,
  onRewriteApply,
}: AuditAnalysisPanelProps) {
  const [text, setText] = useState('');
  const [isRewriting, setIsRewriting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, status, sendMessage, regenerate, error } = useChat({
    onError: (err) => {
      console.error('Chat error:', err);
      toast.error('Failed to get AI response. Please try again.');
    },
  });

  const handleSubmit = async (message: PromptInputMessage) => {
    if (!message.text?.trim()) return;

    sendMessage(
      { text: message.text },
      {
        body: {
          pageContent: JSON.stringify(pageAudit.metadata),
          pageUrl: pageAudit.url,
          selectedSection: selectedSection ? JSON.stringify(selectedSection) : null,
        },
      }
    );

    setText('');
  };

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success('Copied to clipboard');
  };

  const handleRegenerate = () => {
    regenerate();
  };

  const handleAIRewrite = async () => {
    if (!selectedSection) return;

    setIsRewriting(true);
    const prompt = `Rewrite and improve this ${selectedSection.type} for better SEO and AI visibility: "${selectedSection.content}". ${selectedSection.issues?.map(i => i.message).join('. ') || ''}`;

    sendMessage(
      { text: prompt },
      {
        body: {
          pageContent: JSON.stringify(pageAudit.metadata),
          pageUrl: pageAudit.url,
          selectedSection: JSON.stringify(selectedSection),
        },
      }
    );
    setIsRewriting(false);
  };

  // Extract text content from message parts
  const getMessageText = (message: (typeof messages)[0]): string => {
    if (!message.parts) return '';
    return message.parts
      .filter((part) => part.type === 'text')
      .map((part) => ('text' in part ? part.text : ''))
      .join('');
  };

  const issues = pageAudit.issues || [];
  const analysis = pageAudit.analysis;
  const criticalCount = issues.filter((i: PageIssue) => i.severity === 'critical').length;
  const warningCount = issues.filter((i: PageIssue) => i.severity === 'warning').length;
  const infoCount = issues.filter((i: PageIssue) => i.severity === 'info').length;

  return (
    <div className="dark:bg-polar-900 dark:border-polar-800 flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xs">
      {/* Header */}
      <div className="dark:border-polar-800 flex h-14 shrink-0 items-center justify-between border-b border-gray-200 px-4">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="font-medium text-sm">Analysis & AI</span>
        </div>
        <button
          onClick={onCollapse}
          className="dark:hover:bg-polar-700 relative flex h-6 w-6 cursor-pointer select-none items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-transparent p-2 text-sm font-medium text-black ring-offset-background transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-transparent dark:text-white [&_svg]:pointer-events-none [&_svg]:size-4! [&_svg]:shrink-0"
          type="button"
          aria-label="Collapse panel"
          title="Collapse panel"
        >
          <PanelRightClose className="h-4 w-4" />
        </button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={selectedSection ? 'ai' : 'issues'} className="flex-1 flex flex-col min-h-0">
        <div className="shrink-0 border-b border-gray-200 dark:border-polar-800 px-2">
          <TabsList className="bg-transparent h-10">
            <TabsTrigger value="issues" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Issues
              {criticalCount > 0 && (
                <Badge variant="outline" className="h-4 w-4 p-0 text-[10px] flex items-center justify-center text-red-600 border-red-300 bg-red-50 dark:bg-red-950/30">
                  {criticalCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="insights" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="ai" className="text-xs data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              AI
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Issues Tab */}
        <TabsContent value="issues" className="flex-1 overflow-y-auto m-0 p-4 space-y-3">
          {/* Summary */}
          <div className="flex gap-2 text-xs">
            <Badge variant="outline" className="gap-1 text-red-600 border-red-300 bg-red-50 dark:bg-red-950/30">
              <AlertTriangle className="h-3 w-3" />
              {criticalCount}
            </Badge>
            <Badge variant="outline" className="gap-1 text-amber-600 border-amber-300">
              <AlertCircle className="h-3 w-3" />
              {warningCount}
            </Badge>
            <Badge variant="outline" className="gap-1 text-blue-600 border-blue-300">
              <Info className="h-3 w-3" />
              {infoCount}
            </Badge>
          </div>

          {/* Issue Cards */}
          {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CheckCircle2 className="h-10 w-10 text-green-500 mb-3" />
              <p className="text-sm font-medium">No issues found!</p>
              <p className="text-xs text-muted-foreground mt-1">
                This page looks great.
              </p>
            </div>
          ) : (
            issues.map((issue, idx) => (
              <IssueCard key={idx} issue={issue} />
            ))
          )}
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="flex-1 overflow-y-auto m-0 p-4 space-y-4">
          {/* Strengths */}
          {analysis?.strengths && analysis.strengths.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                Strengths
              </span>
              {analysis.strengths.map((strength: { title: string; description: string; impact?: string }, idx: number) => (
                <StrengthCard key={idx} strength={strength} />
              ))}
            </div>
          )}

          {/* Recommendations */}
          {analysis?.recommendations && analysis.recommendations.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Lightbulb className="h-3 w-3 text-amber-500" />
                Recommendations
              </span>
              {analysis.recommendations.map((rec, idx) => (
                <RecommendationCard key={idx} rec={rec} />
              ))}
            </div>
          )}

          {/* AEO Readiness */}
          {analysis?.aeoReadiness && (
            <div className="rounded-xl border border-gray-200 dark:border-polar-700 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">AEO Readiness</span>
                <Badge
                  variant="outline"
                  className={cn(
                    'capitalize',
                    analysis.aeoReadiness.status === 'good' && 'text-green-600 border-green-300',
                    analysis.aeoReadiness.status === 'needs-improvement' && 'text-amber-600 border-amber-300',
                  )}
                >
                  {analysis.aeoReadiness.status}
                </Badge>
              </div>
              <div className="space-y-2">
                {Object.entries(analysis.aeoReadiness.factors).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground capitalize w-24 shrink-0">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-polar-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full',
                          value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-amber-500' : 'bg-red-500'
                        )}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono w-8 text-right">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* AI Tab */}
        <TabsContent value="ai" className="flex-1 flex flex-col min-h-0 m-0">
          {/* Selected Section */}
          {selectedSection && (
            <div className="shrink-0 p-4 border-b border-gray-200 dark:border-polar-800">
              <SelectedSectionPanel
                section={selectedSection}
                onAIRewrite={handleAIRewrite}
                isRewriting={isRewriting || status === 'streaming'}
              />
            </div>
          )}

          {/* Chat Content */}
          <div className="flex-1 min-h-0 overflow-hidden">
            <Conversation className="h-full">
              <ConversationContent className="items-start px-4">
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    description={
                      selectedSection
                        ? "Click 'AI Rewrite' above or ask me to improve the selected content."
                        : "Select content from the left panel, or ask me to help optimize your page for SEO and AI visibility."
                    }
                    icon={<Sparkles className="size-6" />}
                    title="Content AI Assistant"
                  />
                ) : (
                  <>
                    {error && (
                      <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                        <p className="text-sm font-medium text-destructive">
                          Error: {error.message}
                        </p>
                      </div>
                    )}
                    {messages.map((message) => {
                      const messageText = getMessageText(message);
                      return (
                        <Message key={message.id} from={message.role}>
                          <MessageContent>
                            <MessageResponse>{messageText}</MessageResponse>
                          </MessageContent>
                          {message.role === 'assistant' && (
                            <MessageActions>
                              <MessageAction
                                onClick={handleRegenerate}
                                label="Retry"
                                tooltip="Regenerate response"
                              >
                                <RefreshCcwIcon className="size-3" />
                              </MessageAction>
                              <MessageAction
                                onClick={() => handleCopy(messageText)}
                                label="Copy"
                                tooltip="Copy to clipboard"
                              >
                                <CopyIcon className="size-3" />
                              </MessageAction>
                              {onRewriteApply && (
                                <MessageAction
                                  onClick={() => onRewriteApply(messageText)}
                                  label="Apply"
                                  tooltip="Apply this suggestion"
                                >
                                  <CheckCircle2 className="size-3" />
                                </MessageAction>
                              )}
                            </MessageActions>
                          )}
                        </Message>
                      );
                    })}
                  </>
                )}
                {status === 'submitted' && <Loader />}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          {/* Chat Input */}
          <div className="dark:border-polar-800 shrink-0 border-t border-gray-200 px-4 py-3">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputBody>
                <PromptInputTextarea
                  onChange={(e) => setText(e.target.value)}
                  ref={textareaRef}
                  value={text}
                  placeholder="Ask AI to help improve this page..."
                  className="min-h-10 max-h-32"
                />
              </PromptInputBody>
              <PromptInputFooter>
                <div className="flex-1" />
                <PromptInputSubmit
                  disabled={!text.trim() || status === 'streaming'}
                  status={status}
                  className="rounded-full"
                />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

