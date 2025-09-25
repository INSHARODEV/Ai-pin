import * as React from 'react';
import Table, { type TableCell } from './reusable/Table';
import { Shift } from '../types';
import Link from 'next/link';

interface Props {
  shifts: Shift[];
  emptyMessage?: React.ReactNode;
}

export default function ManagerLastShiftsTable({
  shifts,
  emptyMessage,
}: Props) {
  const headers = [
    'Status',
    'Branch',
    'Date',
    'Time',
    'Shift Performance',
    'Details',
  ];

  const rows: TableCell[][] = (shifts ?? []).map(shift => {
    // Map performance number to label used in the UI
    const performanceLabel =
      shift.performance === 0
        ? 'Critical'
        : shift.performance > 80
          ? 'High'
          : 'Average';

    // Map any truthy/enum status to dot colors (green | orange | red)
    const statusColor =
      (shift as any).status ??
      (performanceLabel === 'Critical'
        ? 'red'
        : performanceLabel === 'High'
          ? 'green'
          : 'orange');

    const branchName =
      (shift as any).branchName ?? shift.fullName ?? 'Branch Name';
    const branchHref = `/branch/${(shift as any).branchId ?? shift.empId ?? ''}`;

    return [
      { kind: 'status', value: statusColor }, // left colored dot
      branchName,
      shift.date,
      shift.startTime,
      { kind: 'badge', value: performanceLabel as any },
      // “View Branch” link
      <Link
        href={branchHref}
        key={`b-${(shift as any).branchId ?? shift.empId}`}
        className='text-blue-600 hover:underline'
      >
        View Branch
      </Link>,
    ];
  });

  return <Table headers={headers} data={rows} emptyMessage={emptyMessage} />;
}
