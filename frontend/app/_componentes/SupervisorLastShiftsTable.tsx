// components/SupervisorLastShiftsTable.
'use client'
import * as React from 'react';
import Table, { type TableCell } from './reusable/Table';
import { Shift } from '../types';
import Link from 'next/link';

interface Props {
  shifts: Shift[];
  emptyMessage?: React.ReactNode; // NEW
}

export default function SupervisorLastShiftsTable({
  shifts,
  emptyMessage,
}: Props) {
  const headers = ['Name', 'Date', 'Time', 'Shift Performance', 'Details'];
React.useEffect(()=>{
  console.log('shifts',shifts[0])
 
},[])
  const rows: TableCell[][] = (shifts ?? []).map(shift => [
    shift.fullName,
    shift.date,
    shift.startTime,
    {
      kind: 'badge',
      value:
        shift.performance === 0
          ? 'Low'
          : shift.performance > 80
            ? 'High'
            : 'Standard',
    },
    <Link href={`/employee-profile/${shift.empId}`}>Details</Link>,
  ]);

  return <Table headers={headers} data={rows} emptyMessage={emptyMessage} />;
}
