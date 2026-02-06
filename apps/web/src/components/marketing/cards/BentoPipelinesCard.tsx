'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

import {
  Card,
} from '@workspace/ui/components/card';
import { cn } from '@workspace/common/lib';

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Content items per month (month index -> day -> content)
const CONTENT_BY_MONTH: Record<number, Record<number, { type: string; color: string; generating?: boolean }>> = {
  0: { // January
    8: { type: 'Tutorial', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
    15: { type: 'Guide', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    22: { type: 'Article', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  },
  1: { // February
    5: { type: 'Tutorial', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
    12: { type: 'Guide', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    18: { type: 'Article', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
    24: { type: 'Writing', color: '', generating: true },
  },
  2: { // March
    3: { type: 'Guide', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300' },
    10: { type: 'Tutorial', color: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300' },
    20: { type: 'Writing', color: '', generating: true },
    27: { type: 'Article', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
  },
};

function getCalendarDays(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Adjust for Monday start (0 = Mon, 6 = Sun)
  const startPadding = firstDay === 0 ? 6 : firstDay - 1;
  
  const days: (number | null)[] = [];
  
  // Add padding for days before the 1st
  for (let i = 0; i < startPadding; i++) {
    days.push(null);
  }
  
  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  // Pad to complete the grid (5 rows = 35 cells)
  while (days.length < 35) {
    days.push(null);
  }
  
  return days;
}

const MotionCard = motion.create(Card);

export function BentoPipelinesCard({
  className,
  ...other
}: React.ComponentPropsWithoutRef<typeof MotionCard>): React.JSX.Element {
  const [monthOffset, setMonthOffset] = React.useState(0);
  
  const baseDate = new Date(2026, 1); // February 2026
  const currentDate = new Date(baseDate.getFullYear(), baseDate.getMonth() + monthOffset);
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const calendarDays = getCalendarDays(year, month);
  const contentItems = CONTENT_BY_MONTH[month] || {};

  return (
    <MotionCard
      className={cn(
        'relative flex h-[300px] max-h-[300px] flex-col overflow-hidden',
        className
      )}
      {...other}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2">
        <h3 className="text-base font-semibold">Content Calendar</h3>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-md border">
            <button 
              onClick={() => setMonthOffset(prev => prev - 1)}
              className="flex h-7 w-7 items-center justify-center rounded-l-md hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="min-w-[90px] border-x px-2 text-center text-xs font-medium">
              {MONTHS[month]} {year}
            </span>
            <button 
              onClick={() => setMonthOffset(prev => prev + 1)}
              className="flex h-7 w-7 items-center justify-center rounded-r-md hover:bg-muted"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {monthOffset !== 0 && (
            <button 
              onClick={() => setMonthOffset(0)}
              className="rounded-md border px-2 py-1 text-[10px] font-medium hover:bg-muted"
            >
              Today
            </button>
          )}
        </div>
      </div>
      
      {/* Calendar */}
      <div className="flex flex-1 flex-col p-2">
        {/* Days header */}
        <div className="mb-1 grid grid-cols-7">
          {DAYS.map((day, i) => (
            <div key={i} className="text-center text-[10px] font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <motion.div 
          key={`${year}-${month}`}
          className="grid flex-1 grid-cols-7 grid-rows-5 gap-0.5"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
        >
          {calendarDays.map((day, index) => {
            const content = day ? contentItems[day] : null;
            return (
              <div
                key={index}
                className={cn(
                  'flex flex-col rounded border border-border/30 p-1',
                  day === null && 'border-transparent bg-muted/20',
                  content && 'bg-muted/50'
                )}
              >
                {day !== null && (
                  <>
                    <span className="text-[10px] text-muted-foreground">{day}</span>
                    {content && (
                      <div className="mt-auto">
                        {content.generating ? (
                          <motion.div 
                            className="flex items-center gap-0.5 text-purple-600 dark:text-purple-400"
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                          </motion.div>
                        ) : (
                          <div className={cn('rounded px-1 py-0.5 text-[8px] font-medium leading-none', content.color)}>
                            {content.type}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </motion.div>
      </div>
    </MotionCard>
  );
}
