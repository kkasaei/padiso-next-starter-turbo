'use client';

import { Globe, FileText, Sparkles, Link2, ImageIcon, Zap, Play, Loader2 } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { AUDIT_FEATURES } from './constants';

// ============================================================
// FEATURE ICONS MAP
// ============================================================
const featureIcons: Record<string, React.ReactNode> = {
  seo: <FileText className="h-5 w-5 text-blue-500" />,
  aeo: <Sparkles className="h-5 w-5 text-purple-500" />,
  links: <Link2 className="h-5 w-5 text-teal-500" />,
  images: <ImageIcon className="h-5 w-5 text-orange-500" />,
  quickwins: <Zap className="h-5 w-5 text-amber-500" />,
};

// ============================================================
// PROPS
// ============================================================
interface AuditIntroSectionProps {
  onRunAudit: () => void;
  isStarting: boolean;
}

// ============================================================
// FEATURE ITEM COMPONENT
// ============================================================
function FeatureItem({
  id,
  title,
  description,
  bgColor,
}: {
  id: string;
  title: string;
  description: string;
  bgColor: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${bgColor}`}>
        {featureIcons[id]}
      </div>
      <div>
        <h4 className="mb-1 font-semibold dark:text-white">{title}</h4>
        <p className="text-sm text-gray-600 dark:text-polar-400">{description}</p>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export function AuditIntroSection({ onRunAudit, isStarting }: AuditIntroSectionProps) {
  return (
    <div className="relative flex h-full w-full min-w-0 flex-col items-center overflow-y-auto rounded-2xl border-gray-200 dark:border-polar-800 px-4 md:border md:bg-white dark:md:bg-polar-900 md:px-8 md:shadow-xs">
      <div className="flex h-full w-full items-center justify-center py-8">
        <div className="dark:bg-polar-800 flex w-full max-w-7xl flex-col gap-12 rounded-4xl bg-gray-100 p-4 md:flex-row">
          {/* Left: Introduction */}
          <div className="flex w-full flex-col gap-6 p-6 md:max-w-sm">
            <div className="flex flex-col gap-y-2">
              <div className="mb-2 flex items-center gap-2">
                <Globe className="h-6 w-6 text-blue-500" />
                <h2 className="text-2xl dark:text-white">Website Audit</h2>
              </div>
            </div>
            <div className="flex grow flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <p className="dark:text-polar-300 text-gray-700">
                  Comprehensive AI-driven website analysis to identify SEO issues and AEO optimization opportunities.
                </p>
                <p className="dark:text-polar-300 text-gray-700">
                  Get actionable insights on content quality, structured data, meta tags, and quick wins to improve
                  your search and AI visibility.
                </p>
              </div>
              <Button onClick={onRunAudit} disabled={isStarting} className="w-full gap-2 rounded-xl">
                {isStarting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Starting...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Run First Audit
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Right: Features List */}
          <div className="dark:bg-polar-900 flex flex-1 shrink flex-col gap-y-4 overflow-auto rounded-3xl bg-white p-6">
            <h3 className="mb-2 text-lg font-semibold dark:text-white">What We Analyze</h3>
            <div className="flex flex-col gap-4">
              {AUDIT_FEATURES.map((feature) => (
                <FeatureItem
                  key={feature.id}
                  id={feature.id}
                  title={feature.title}
                  description={feature.description}
                  bgColor={feature.bgColor}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

