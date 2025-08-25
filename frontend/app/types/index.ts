export type BadgeVariant =
  | 'default'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'success'
  | 'warning'
  | 'info'
  | 'neutral';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export type TrendDirection = 'up' | 'down';

export type StatColor = 'blue' | 'green' | 'red';

export type ShiftPerformance =
  | 'Friendly'
  | 'Confused'
  | 'Neutral'
  | 'Frustrated'
  | 'Aggressive';

export interface Shift {
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  performance: ShiftPerformance | string;
}
