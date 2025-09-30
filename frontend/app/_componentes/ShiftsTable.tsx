import * as React from 'react';
import { Shift } from '../types';
import Table, { type TableCell, type BadgeValue } from './reusable/Table';

function toBadgeValue(v: unknown): BadgeValue {
  const n = Number(v);
  if (!Number.isNaN(n)) {
    if (n < 1.5) return 'Critical';
    if (n < 2.5) return 'Low';
    if (n < 3.5) return 'Average';
    if (n < 4.5) return 'Standard';
    return 'High';
  }
  const s = String(v || '').toLowerCase();
  const map: Record<string, BadgeValue> = {
    critical: 'Critical',
    low: 'Low',
    average: 'Average',
    standard: 'Standard',
    high: 'High',
  };
  return map[s] ?? 'Average';
}

export interface ShiftsTableProps {
  shifts: Shift[];
}

const PAGE_SIZE = 7;

export function ShiftsTable({ shifts }: ShiftsTableProps) {
  const pages = React.useMemo(() => {
    const arr = Array.isArray(shifts) ? shifts.slice(0, 14) : [];
    return [
      arr.slice(0, PAGE_SIZE),
      arr.slice(PAGE_SIZE, PAGE_SIZE * 2),
    ].filter(p => p.length > 0);
  }, [shifts]);

  const [pageIndex, setPageIndex] = React.useState(0);
  const hasPrev = pageIndex > 0;
  const hasNext = pageIndex < pages.length - 1;

  const page = pages[pageIndex] || [];
  const headers = [
    'Shift Date',
    'Start Time',
    'End Time',
    'Duration',
    'Performance',
  ];

  const data: TableCell[][] = page.map(s => [
    s.date,
    s.startTime,
    s.endTime,
    s.duration,
    { kind: 'badge', value: toBadgeValue(s.performance) },
  ]);

  return (
    <div className='bg-inherit overflow-hidden'>
      <div className='flex items-center justify-between py-6'>
        <h3 className='text-xl font-semibold text-gray-900'>Last Shifts</h3>
        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => setPageIndex(i => Math.max(0, i - 1))}
            disabled={!hasPrev}
            className='rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50'
          >
            Prev
          </button>
          <span className='text-sm text-gray-600'>
            Page {pages.length ? pageIndex + 1 : 0} of {pages.length || 0}
          </span>
          <button
            type='button'
            onClick={() => setPageIndex(i => Math.min(pages.length - 1, i + 1))}
            disabled={!hasNext}
            className='rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50'
          >
            Next
          </button>
        </div>
      </div>
      <Table headers={headers} data={data} />
    </div>
  );
}
