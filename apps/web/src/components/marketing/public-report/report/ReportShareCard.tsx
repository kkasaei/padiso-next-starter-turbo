import * as React from 'react';
import Confetti from 'react-confetti';
import { Share2 } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';
import { REPORT_CONFIG } from '@workspace/common/constants';

interface ReportShareCardProps {
  averageScore: number;
  onShare: () => void;
}

/**
 * Share card with confetti animation
 * Manages its own hover state and confetti animation internally
 */
export function ReportShareCard({
  averageScore,
  onShare
}: ReportShareCardProps): React.JSX.Element {
  const [showConfetti, setShowConfetti] = React.useState(false);
  const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Update dimensions when showConfetti changes or on mount
  React.useEffect(() => {
    if (cardRef.current) {
      setDimensions({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      });
    }
  }, [showConfetti]);

  // Dynamic messaging based on score
  const getShareMessage = () => {
    if (averageScore >= 70) {
      return {
        title: 'Share Your Performance',
        description: 'Demonstrate your AI search leadership and showcase your brand\'s exceptional visibility across leading answer engines.'
      };
    } else if (averageScore >= 50) {
      return {
        title: 'Share Your Progress',
        description: 'Highlight your commitment to AI search optimization and position your brand at the forefront of emerging search technologies.'
      };
    } else {
      return {
        title: 'Share Your Benchmark',
        description: 'Showcase your strategic initiative in AI search optimization and demonstrate your proactive approach to digital visibility.'
      };
    }
  };

  const shareMessage = getShareMessage();

  return (
    <div
      ref={cardRef}
      className="group relative overflow-hidden rounded-xl bg-white p-8 transition-all duration-300 hover:border hover:shadow-xl dark:bg-background md:p-10"
      onMouseEnter={() => setShowConfetti(true)}
      onMouseLeave={() => setShowConfetti(false)}
    >
      {/* Gradient background - only visible on hover */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Confetti animation on hover */}
      {showConfetti && dimensions.width > 0 && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={REPORT_CONFIG.CONFETTI_PARTICLE_COUNT}
          gravity={REPORT_CONFIG.CONFETTI_GRAVITY}
          colors={[...REPORT_CONFIG.CONFETTI_COLORS]}
        />
      )}

      <div className="relative">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:gap-8 md:text-left">
          {/* Score Display */}
          <div className="flex shrink-0 flex-col items-center justify-center rounded-xl border-2 border-foreground bg-foreground p-8 text-background shadow-xl md:p-10">
            <div className="text-6xl font-bold md:text-7xl">
              {averageScore}
            </div>
            <div className="mt-2 text-xs font-semibold uppercase tracking-widest opacity-80">
              AEO Score
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-5">
            <div className="space-y-3">
              <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
                {shareMessage.title}
              </h3>
              <p className="text-base text-muted-foreground md:text-lg">
                {shareMessage.description}
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                onClick={onShare}
                className="rounded-xl font-semibold"
              >
                <Share2 className="mr-2 size-5" />
                Share Report
              </Button>
            </div>

            {/* SearchFit Branding */}
            <div className="flex items-center justify-center gap-2 border-t pt-4 text-sm font-medium text-muted-foreground md:justify-start">
              <span>Powered by</span>
              <span className="font-bold text-foreground">SearchFit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
