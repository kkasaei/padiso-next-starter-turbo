'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

import { cn } from '@workspace/common/lib';

const AI_PLATFORMS = [
  { name: 'ChatGPT', icon: '/icons/openai.svg', color: '#10a37f' },
  { name: 'Perplexity', icon: '/icons/perplexity.svg', color: '#20808d' },
  { name: 'Claude', icon: '/icons/claude.svg', color: '#d97706' },
  { name: 'Gemini', icon: '/icons/gemini.svg', color: '#4285f4' },
  { name: 'Grok', icon: '/icons/xai.svg', color: '#000000' },
  { name: 'DeepSeek', icon: '/icons/deepseek.svg', color: '#0066ff' },
];

function PlatformIcon({ platform, x, y }: { platform: typeof AI_PLATFORMS[0]; x: number; y: number }) {
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 cursor-pointer"
      style={{ 
        x: x - 22,
        y: y - 22,
      }}
      animate={{ rotate: -360 }}
      transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl border bg-background shadow-sm transition-all duration-200',
        )}
        style={{
          borderColor: isHovered ? platform.color : undefined,
          boxShadow: isHovered ? `0 0 20px ${platform.color}40, 0 0 40px ${platform.color}20` : undefined,
        }}
        animate={{ scale: isHovered ? 1.15 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Image
          src={platform.icon}
          alt={platform.name}
          width={22}
          height={22}
          className="dark:invert"
          style={{
            filter: isHovered ? `drop-shadow(0 0 4px ${platform.color})` : undefined,
          }}
        />
      </motion.div>
      {isHovered && (
        <motion.div
          className="absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium"
          style={{ backgroundColor: platform.color, color: platform.color === '#000000' ? '#fff' : '#fff' }}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
        >
          {platform.name}
        </motion.div>
      )}
    </motion.div>
  );
}

export function AiAdvisorCard({
  className,
  ...props
}: React.ComponentProps<'div'>): React.JSX.Element {
  const [score, setScore] = React.useState(64);
  
  React.useEffect(() => {
    const interval = setInterval(() => {
      setScore((prev) => {
        if (prev >= 87) return 64;
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const orbitRadius = 160;

  return (
    <div
      className={cn('relative flex h-[420px] items-center justify-center', className)}
      {...props}
    >
      {/* Orbit ring */}
      <motion.div 
        className="absolute h-[340px] w-[340px] rounded-full border border-dashed border-border/50"
        animate={{ rotate: 360 }}
        transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
      >
        {AI_PLATFORMS.map((platform, index) => {
          const angle = (index * 360) / AI_PLATFORMS.length - 90;
          const radian = (angle * Math.PI) / 180;
          const x = Math.cos(radian) * orbitRadius;
          const y = Math.sin(radian) * orbitRadius;
          return (
            <PlatformIcon 
              key={platform.name} 
              platform={platform} 
              x={x} 
              y={y} 
            />
          );
        })}
      </motion.div>

      {/* Center brand */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.div 
          className="text-5xl font-semibold tabular-nums"
          key={score}
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {score}
        </motion.div>
        <div className="mt-2 text-center">
          <div className="text-base font-medium">Your Brand</div>
          <div className="mt-1 flex items-center justify-center gap-1 text-sm text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5 text-green-600" />
            <span className="text-green-600">Score increasing</span>
          </div>
        </div>
      </div>
    </div>
  );
}
