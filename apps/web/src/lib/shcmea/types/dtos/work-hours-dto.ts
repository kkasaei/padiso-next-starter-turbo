import type { DayOfWeek } from '@/lib/db';

import type { WorkTimeSlotDto } from './work-time-slot-dto';

export type WorkHoursDto = {
  dayOfWeek: DayOfWeek;
  isEnabled: boolean;
  timeSlots: WorkTimeSlotDto[];
};

