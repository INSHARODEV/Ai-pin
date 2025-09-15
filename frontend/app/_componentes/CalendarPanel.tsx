'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';

const ChevronLeft = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <polyline points='15 18 9 12 15 6' />
  </svg>
);
const ChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    aria-hidden='true'
    {...props}
  >
    <polyline points='9 18 15 12 9 6' />
  </svg>
);

/*************************
 * Types
 *************************/
export type WeekStart = 0 | 1; // 0 = Sunday, 1 = Monday
export type MarkerPredicate = (date: Date) => boolean;

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface CalendarPropsBase {
  /** Month to show initially (defaults to today) */
  initialMonth?: Date;
  /** 0 = Sunday, 1 = Monday (default) */
  weekStartsOn?: WeekStart;
  /** Dates to show marker dot (or function returning boolean) */
  markers?: Date[] | MarkerPredicate;
  /** Min/Max date constraints */
  min?: Date;
  max?: Date;
  /** Optional className for the outer panel */
  className?: string;
}

export interface RangeCalendarProps extends CalendarPropsBase {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
}

/*************************
 * Date helpers
 *************************/
function startOfMonth(d: Date) {
  const x = new Date(d);
  x.setDate(1);
  x.setHours(0, 0, 0, 0);
  return x;
}
function addMonths(d: Date, count: number) {
  const x = new Date(d);
  x.setMonth(x.getMonth() + count);
  return startOfMonth(x);
}
function daysInMonth(d: Date) {
  const year = d.getFullYear();
  const month = d.getMonth();
  return new Date(year, month + 1, 0).getDate();
}
function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function toKey(d: Date) {
  return +new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function clampToRange(d: Date, min?: Date, max?: Date) {
  let x = d;
  if (min && x < min) x = min;
  if (max && x > max) x = max;
  return x;
}
function disabled(d: Date, min?: Date, max?: Date) {
  if (min && d < min) return true;
  if (max && d > max) return true;
  return false;
}
function monthLabel(d: Date) {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    year: 'numeric',
  }).format(d);
}
function fullDate(d: Date) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'full' }).format(d);
}
function getColStartForFirstDay(date: Date, weekStartsOn: WeekStart) {
  const day = startOfMonth(date).getDay(); // 0..6 (Sun..Sat)
  const adjusted = (day - weekStartsOn + 7) % 7; // 0..6 where 0 is first col
  return adjusted + 1; // 1..7 for CSS gridColumnStart
}
const WEEK_LABELS: Record<WeekStart, string[]> = {
  1: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  0: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
};

/*************************
 * Range Calendar (panel)
 *************************/
export function RangeCalendarPanel({
  value,
  onChange,
  initialMonth,
  weekStartsOn = 1,
  markers,
  min,
  max,
  className = '',
}: RangeCalendarProps) {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState<Date>(() =>
    startOfMonth(initialMonth ?? value?.from ?? today)
  );
  const [focusDate, setFocusDate] = useState<Date>(() =>
    clampToRange(value?.from ?? today, min, max)
  );
  const [hover, setHover] = useState<Date | null>(null);

  const from = value?.from ?? null;
  const to = value?.to ?? null;

  const totalDays = daysInMonth(month);
  const firstCol = getColStartForFirstDay(month, weekStartsOn);
  const labels = WEEK_LABELS[weekStartsOn];

  const hasMarker = useMemo<MarkerPredicate>(() => {
    if (!markers) return () => false;
    if (typeof markers === 'function') return markers;
    const keySet = new Set(markers.map(d => toKey(d)));
    return (d: Date) => keySet.has(toKey(d));
  }, [markers]);

  function inRange(d: Date) {
    if (!from) return false;
    const end = to ?? hover;
    if (!end) return false;
    const a = toKey(from),
      b = toKey(end),
      x = toKey(d);
    return x > Math.min(a, b) && x < Math.max(a, b);
  }
  function isStart(d: Date) {
    return !!from && sameDay(d, from);
  }
  function isEnd(d: Date) {
    return !!to && sameDay(d, to);
  }

  function selectDay(d: Date) {
    if (disabled(d, min, max)) return;
    if (!from || (from && to)) {
      onChange?.({ from: d, to: null });
      setHover(null);
    } else if (from && !to) {
      if (toKey(d) < toKey(from)) {
        onChange?.({ from: d, to: from });
      } else if (toKey(d) === toKey(from)) {
        // single-day range
        onChange?.({ from: d, to: d });
      } else {
        onChange?.({ from, to: d });
      }
      setHover(null);
    }
  }

  function onGridKeyDown(e: React.KeyboardEvent) {
    let next = new Date(focusDate);
    if (e.key === 'ArrowLeft') next.setDate(next.getDate() - 1);
    else if (e.key === 'ArrowRight') next.setDate(next.getDate() + 1);
    else if (e.key === 'ArrowUp') next.setDate(next.getDate() - 7);
    else if (e.key === 'ArrowDown') next.setDate(next.getDate() + 7);
    else if (e.key === 'PageUp') next = addMonths(next, -1);
    else if (e.key === 'PageDown') next = addMonths(next, 1);
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      selectDay(focusDate);
      return;
    } else return;
    e.preventDefault();
    next = clampToRange(next, min, max);
    setFocusDate(next);
    setMonth(startOfMonth(next));
  }

  return (
    <div
      role='dialog'
      aria-label='Date range picker'
      className={`w-[320px] rounded-2xl bg-white shadow-custom p-3 sm:p-4 ${className}`}
      onKeyDown={onGridKeyDown}
    >
      {/* Header */}
      <div className='flex items-center justify-between mb-2'>
        <button
          type='button'
          onClick={() => setMonth(m => addMonths(m, -1))}
          className='p-2 rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          aria-label='Previous month'
        >
          <ChevronLeft className='w-4 h-4' />
        </button>
        <div id='cal-label' className='text-sm font-semibold select-none'>
          {monthLabel(month)}
        </div>
        <button
          type='button'
          onClick={() => setMonth(m => addMonths(m, 1))}
          className='p-2 rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
          aria-label='Next month'
        >
          <ChevronRight className='w-4 h-4' />
        </button>
      </div>

      {/* Week labels */}
      <div className='grid grid-cols-7 gap-y-1 px-1 mb-1 text-[11px] text-muted-foreground'>
        {labels.map(l => (
          <div key={l} className='flex items-center justify-center select-none'>
            {l}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div
        role='grid'
        aria-labelledby='cal-label'
        className='grid grid-cols-7 gap-1.5'
      >
        {Array.from({ length: totalDays }).map((_, i) => {
          const day = i + 1;
          const date = new Date(month.getFullYear(), month.getMonth(), day);
          const isDisabled = disabled(date, min, max);
          const isFocused = sameDay(date, focusDate);
          const selStart = isStart(date);
          const selEnd = isEnd(date);
          const between = inRange(date);

          const colStart =
            day === 1 ? { gridColumnStart: firstCol } : undefined;

          return (
            <div key={day} style={colStart} className='aspect-square'>
              <button
                type='button'
                role='gridcell'
                aria-selected={selStart || selEnd}
                aria-label={`Select ${fullDate(date)}`}
                disabled={isDisabled}
                onClick={() => selectDay(date)}
                onFocus={() => setFocusDate(date)}
                onMouseEnter={() => setHover(date)}
                onMouseLeave={() => setHover(null)}
                tabIndex={isFocused ? 0 : -1}
                className={
                  `relative w-full h-full rounded-xl text-sm flex items-center justify-center select-none outline-none ` +
                  `transition-colors ` +
                  (isDisabled
                    ? 'text-muted-foreground/50 cursor-not-allowed'
                    : 'hover:bg-muted cursor-pointer') +
                  (selStart || selEnd
                    ? ' bg-[#0D70C81A] text-[#0D70C8] font-semibold'
                    : '') +
                  (between ? ' bg-[#0D70C80D]' : '')
                }
              >
                {/* marker dot (left side) */}
                {hasMarker(date) && (
                  <span
                    className={`absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full ${selStart || selEnd ? 'bg-[#0D70C8]' : 'bg-primary'}`}
                  />
                )}
                {day}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/*************************
 * Popover wrapper bound to a custom trigger
 *************************/
export interface DateRangePopoverProps
  extends Omit<RangeCalendarProps, 'className'> {
  /** Called after selecting the end date (from & to both set) */
  onComplete?: (range: DateRange) => void;
  /** Render prop: you provide the trigger node (button/div) */
  renderTrigger: (args: {
    formatted: string;
    open: boolean;
    props: {
      ref: React.Ref<any>;
      onClick: () => void;
      onKeyDown: (e: React.KeyboardEvent) => void;
      role: string;
      tabIndex: number;
      'aria-haspopup': 'dialog';
      'aria-expanded': boolean;
    };
  }) => React.ReactNode;
}

export function DateRangePopover({
  value,
  onChange,
  onComplete,
  renderTrigger,
  weekStartsOn = 1,
  markers,
  min,
  max,
  initialMonth,
}: DateRangePopoverProps) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!open) return;
      const t = e.target as Node;
      if (panelRef.current?.contains(t) || btnRef.current?.contains(t)) return;
      setOpen(false);
    }
    window.addEventListener('mousedown', handle);
    return () => window.removeEventListener('mousedown', handle);
  }, [open]);

  // Close on Esc
  useEffect(() => {
    function handle(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, []);

  const formatted = formatRange(value);

  function handleChange(r: DateRange) {
    onChange?.(r);
    if (r.from && r.to) {
      onComplete?.(r);
      setOpen(false);
    }
  }

  return (
    <div className='relative inline-block'>
      {renderTrigger({
        formatted,
        open,
        props: {
          ref: (node: any) => (btnRef.current = node),
          onClick: () => setOpen(v => !v),
          onKeyDown: e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setOpen(v => !v);
            }
          },
          role: 'button',
          tabIndex: 0,
          'aria-haspopup': 'dialog',
          'aria-expanded': open,
        },
      })}

      {open && (
        <div ref={panelRef} className='absolute z-50 mt-2'>
          <RangeCalendarPanel
            value={value}
            onChange={handleChange}
            weekStartsOn={weekStartsOn}
            markers={markers}
            min={min}
            max={max}
            initialMonth={initialMonth}
          />
        </div>
      )}
    </div>
  );
}

/*************************
 * Utilities
 *************************/
export function formatRange(range?: DateRange): string {
  if (!range || (!range.from && !range.to)) return 'Select dates';
  const fmt = new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  if (range.from && range.to) {
    return `${fmt.format(range.from)} - ${fmt.format(range.to)}`;
  }
  if (range.from) return fmt.format(range.from);
  if (range.to) return fmt.format(range.to);
  return 'Select dates';
}

/*************************
 * Ready-made trigger matching your header markup
 *************************/
export function HeaderDateRange({
  value,
  onChange,
  weekStartsOn = 1,
  markers,
  min,
  max,
}: Omit<DateRangePopoverProps, 'renderTrigger' | 'onComplete'>) {
  return (
    <DateRangePopover
      value={value}
      onChange={onChange}
      weekStartsOn={weekStartsOn}
      markers={markers}
      min={min}
      max={max}
      renderTrigger={({ formatted, props }) => (
        <div className='relative'>
          {/* Click target that looks exactly like your div */}
          <div
            {...props}
            className='flex items-center gap-2 text-sm font-semibold select-none'
          >
            <div className='p-2 rounded-full bg-[#0D70C81A]' aria-hidden='true'>
              {/* You can replace this with <Calendar /> icon if imported here */}
              <svg
                viewBox='0 0 24 24'
                className='w-4 h-4'
                fill='none'
                stroke='#0D70C8'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect x='3' y='4' width='18' height='18' rx='2' ry='2' />
                <line x1='16' y1='2' x2='16' y2='6' />
                <line x1='8' y1='2' x2='8' y2='6' />
                <line x1='3' y1='10' x2='21' y2='10' />
              </svg>
            </div>
            {formatted}
          </div>
        </div>
      )}
    />
  );
}
