'use client';

import * as React from 'react';
import Link from 'next/link';
import Table, { type TableCell } from './reusable/Table';
import EmptyState from './EmptyState'; // ← import your empty state

type StatusColor = 'green' | 'orange' | 'red';
type PerfLabel = 'High' | 'Average' | 'Critical' | 'Standard' | 'Low';

export interface ManagerEmployeeRow {
  id: string;
  fullName: string;
  branchName: string;
  lastActive?: string;
  lastActiveDate?: string;
  lastActiveTime?: string;
  performance: number | PerfLabel;
  status?: StatusColor;
}

interface Props {
  employees: ManagerEmployeeRow[] | null | undefined;
  emptyMessage?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const toPerfLabel = (p: number | PerfLabel): PerfLabel =>
  typeof p === 'number'
    ? p === 0
      ? 'Critical'
      : p > 80
        ? 'High'
        : 'Average'
    : (p as PerfLabel);

const statusFromPerf = (label: PerfLabel): StatusColor =>
  label === 'High' ? 'green' : label === 'Critical' ? 'red' : 'orange';

export default function ManagerEmployeesTable({
  employees,
  emptyMessage,
  open,
  setOpen,
}: Props) {
  const headers = [
    'Status',
    'Employee Name',
    'Branch',
    'Last Active',
    'Shift Performance',
    'Details',
  ];

  const list = Array.isArray(employees) ? employees : [];
  const rows: TableCell[][] = list.map(e => {
    const perfLabel = toPerfLabel(e.performance);
    const status = e.status ?? statusFromPerf(perfLabel);
    const lastActive =
      e.lastActive ??
      [e.lastActiveDate, e.lastActiveTime].filter(Boolean).join(', ');

    return [
      { kind: 'status', value: status },
      e.fullName,
      e.branchName,
      lastActive,
      { kind: 'badge', value: perfLabel },
      <Link
        key={e.id}
        href={`/branch/employees/${e.id}`}
        className='text-blue-600 hover:underline'
      >
        View Profile
      </Link>,
    ];
  });

  // Default empty state (when parent doesn't provide one)
  const fallbackEmpty = emptyMessage ?? (
    <EmptyState
      image='/file-not-found.svg'
      title='Nothing Found!'
      message='No employees added yet! Add your employees and start tracking.'
      ctaLabel='Add employee'
      onCtaClick={() => setOpen(true)}
    />
  );

  return <Table headers={headers} data={rows} emptyMessage={fallbackEmpty} />;
}
