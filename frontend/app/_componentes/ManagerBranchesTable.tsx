'use client';

import * as React from 'react';
import Link from 'next/link';
import Table, { type TableCell } from './reusable/Table';
import EmptyState from './EmptyState';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

type StatusColor = 'green' | 'orange' | 'red';
type PerfLabel = 'High' | 'Average' | 'Critical' | 'Standard' | 'Low';
type ChangeDir = 'up' | 'down' | 'flat';

export interface ManagerBranchRow {
  id: string;
  name: string;
  lastActive?: string;
  lastActiveDate?: string;
  lastActiveTime?: string;
  performance: number | PerfLabel;
  status?: StatusColor;
  changes?: ChangeDir; // performance change arrow
}

export default function ManagerBranchesTable({
  branches,
  emptyMessage,
  setOpen,
}: {
  branches: ManagerBranchRow[] | null | undefined;
  emptyMessage?: React.ReactNode;
  open?: boolean;
  setOpen: (open: boolean) => void;
}) {
  const headers = [
    'Status',
    'name',
    'Last Active',
    'Last Shift Performance',
    'changes',
    'Details',
  ];

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

  const changeIcon = (dir: ChangeDir | undefined) => {
    switch (dir) {
      case 'up':
        return <ArrowUpRight className='h-4 w-4 text-green-500' />;
      case 'down':
        return <ArrowDownRight className='h-4 w-4 text-rose-500' />;
      default:
        return <Minus className='h-4 w-4 text-amber-500' />;
    }
  };

  const list = Array.isArray(branches) ? branches : [];
  const rows: TableCell[][] = list.map(b => {
    const perfLabel = toPerfLabel(b.performance);
    const status = b.status ?? statusFromPerf(perfLabel);
    const lastActive =
      b.lastActive ??
      [b.lastActiveDate, b.lastActiveTime].filter(Boolean).join(', ');

    return [
      { kind: 'status', value: status },
      b.name,
      lastActive || 'Today',
      { kind: 'badge', value: perfLabel },
      changeIcon(b.changes ?? 'flat'),
      <Link
        key={b.id}
        href={`/branch/branches/${b.id}`}
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
      message='No branches added yet! Add your branches to start tracking.'
      ctaLabel='Add branch'
      onCtaClick={() => setOpen(true)}
    />
  );

  return <Table headers={headers} data={rows} emptyMessage={fallbackEmpty} />;
}
