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
  _id?:string
  date: string;
  startTime: string;
  endTime: string;
  duration: string;
  fullName?:string;
  empId?:string,
  performance: ShiftPerformance | string|any;
}
