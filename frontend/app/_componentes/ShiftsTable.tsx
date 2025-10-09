// ShiftsTable.tsx
import * as React from 'react';
import { Shift } from '../types';
import Table, { BadgeValue, type TableCell } from './reusable/Table';
import { number } from 'zod';

export interface ShiftsTableProps {
  shifts: Shift[];
  numberOfPages:number
  setPage: (page: number) => void;
page:number
}

export function ShiftsTable({ shifts,numberOfPages,page,setPage }: ShiftsTableProps) {
  const headers = [
    'Shift Date',
    'Start Time',
    'End Time',
    'Duration',
    'Performance',
  ];

  const data: TableCell[][] = shifts.map(s => [
    s.date,
    s.startTime,
    s.endTime,
    s.duration,
    { kind: 'badge', value: s.performance as BadgeValue }, // <— make it a badge cell
  ]);

  return (
    <div className='overflow-hidden bg-inherit'>
      <div className='p-6'>
        <h3 className='text-xl font-semibold text-gray-900'>Last 7 Shifts</h3>
      </div>
      <Table headers={headers} data={data}  numberOfPages={numberOfPages} page={page} setPage={setPage}/>
    </div>
  );
}
