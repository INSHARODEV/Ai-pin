'use client';

import * as React from 'react';
import Link from 'next/link';
import Table, { type TableCell } from './reusable/Table';
import EmptyState from './EmptyState'; // ✅ use your illustrated empty state

type StatusColor = 'green' | 'orange' | 'red';
type PerfLabel = 'High' | 'Average' | 'Critical' | 'Standard' | 'Low';

export interface EmployeeShiftRow {
  id: string;
  date: string;
  time: string;
  duration: string;
  performance: number | PerfLabel; // number or label
  status?: StatusColor; // optional (derived from performance if omitted)
}

const toPerfLabel = (p: number | PerfLabel): PerfLabel =>
  typeof p === 'number'
    ? p === 0
      ? 'Critical'
      : p > 80
        ? 'High'
        : 'Average'
    : p;

const statusFromPerf = (label: PerfLabel): StatusColor =>
  label === 'High' ? 'green' : label === 'Critical' ? 'red' : 'orange';

export default function EmployeeShiftsTable({
  shifts,
  emptyMessage,
  onEmptyCta, // optional handler if you want a CTA button
}: {
  shifts: EmployeeShiftRow[] | null | undefined;
  emptyMessage?: React.ReactNode;
  onEmptyCta?: () => void;
}) {
  const headers = [
    'Status',
    'Date',
    'Time',
    'Duration',
    'Shift Performance',
    'Details',
  ];

  const list = Array.isArray(shifts) ? shifts : [];
  const rows: TableCell[][] = list.map(s => {
    const perfLabel = toPerfLabel(s.performance);
    const status = s.status ?? statusFromPerf(perfLabel);

    return [
      { kind: 'status', value: status },
      s.date,
      s.time,
      s.duration,
      { kind: 'badge', value: perfLabel },
      <Link
        key={s.id}
        href={`/branch/shifts/${s.id}`}
        className='text-blue-600 hover:underline'
      >
        View Details
      </Link>,
    ];
  });

  const fallbackEmpty = emptyMessage ?? (
    <EmptyState
      image='/file-not-found.svg'
      title='Nothing Found!'
      message='No shifts recorded yet. Let the employee start working to see their history here.'
      ctaLabel={onEmptyCta ? 'Add shift' : undefined}
      onCtaClick={onEmptyCta}
    />
  );

  return <Table headers={headers} data={rows} emptyMessage={fallbackEmpty} numberOfPages={1}  page={1} setPage={1}/>;
}
