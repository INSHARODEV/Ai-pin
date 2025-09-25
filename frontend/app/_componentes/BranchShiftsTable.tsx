'use client';

import * as React from 'react';
import Link from 'next/link';
import Table, { type TableCell } from './reusable/Table';
import EmptyState from './EmptyState';

type StatusColor = 'green' | 'orange' | 'red' | 'gray';
type PerfLabel = 'High' | 'Average' | 'Critical' | 'In Progress';

export interface BranchShiftRow {
  id: string;
  name: string;
  date: string;
  time: string;
  performanceLabel: PerfLabel;
  status: StatusColor;
}

export default function BranchShiftsTable({
  rows,
  emptyMessage,
  onEmptyCta,
}: {
  rows: BranchShiftRow[];
  emptyMessage?: React.ReactNode;
  /** Optional: show a CTA button in the empty state */
  onEmptyCta?: () => void;
}) {
  const headers = [
    'Status',
    'Name',
    'Date',
    'Time',
    'Shift Performance',
    'Details',
  ];

  const pill = (label: PerfLabel) => {
    if (label === 'In Progress') {
      return (
        <span className='inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700'>
          In Progress
        </span>
      );
    }
    // fall back to Table's badge for the others
    return {
      kind: 'badge' as const,
      value: label === 'Average' ? 'Average' : label,
    };
  };

  const mapRows: TableCell[][] = (rows ?? []).map(r => [
    // status dot (your base Table supports green/orange/red; treat gray as gray OR map it)
    r.status === 'gray'
      ? // If you've extended Table to support gray, switch to: { kind: 'status', value: 'gray' as any }
        ({ kind: 'status', value: 'orange' } as any) // temporary fallback tint
      : ({ kind: 'status', value: r.status } as any),
    r.name,
    r.date,
    r.time,
    pill(r.performanceLabel) as any,
    <Link
      key={r.id}
      href={`/shift/${r.id}`}
      className='text-blue-600 hover:underline'
    >
      View Details
    </Link>,
  ]);

  const fallbackEmpty = emptyMessage ?? (
    <EmptyState
      image='/file-not-found.svg'
      title='Nothing Found!'
      message='No shifts for this branch yet. Once your team starts working, the latest shifts will appear here.'
      ctaLabel={onEmptyCta ? 'Add shift' : undefined}
      onCtaClick={onEmptyCta}
    />
  );

  return (
    <Table headers={headers} data={mapRows} emptyMessage={fallbackEmpty} />
  );
}
