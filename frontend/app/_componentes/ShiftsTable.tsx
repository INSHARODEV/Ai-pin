import * as React from 'react';
import { Shift } from '../types';
import { Card } from './ui/Card';
import Table from './reusable/Table';

export interface ShiftsTableProps {
  shifts: Shift[];
}

export function ShiftsTable({ shifts }: ShiftsTableProps) {
  const headers = [
    'Shift Date',
    'Start Time',
    'End Time',
    'Duration',
    'Performance',
  ];
  const data = shifts.map(s => [
    s.date,
    s.startTime,
    s.endTime,
    s.duration,
    s.performance,
  ]);

  return (
    <Card className='overflow-hidden'>
      <div className='border-b border-gray-200 p-6'>
        <h3 className='text-xl font-semibold text-gray-900'>Last 7 Shifts</h3>
      </div>

      <Table headers={headers} data={data} />
    </Card>
  );
}
