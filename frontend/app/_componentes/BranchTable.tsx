// components/BranchTable.tsx
import * as React from 'react';
import Table, { type TableCell } from './reusable/Table';

export default function BranchTable() {
  const headers = [
    'Status',
    'Name',
    'Date',
    'Time',
    'Shift Performance',
    'Details',
  ];

  const rows: TableCell[][] = [
    [
      { kind: 'status', value: 'orange' },
      'Full Name',
      '12th August 2025',
      '12:45 PM',
      { kind: 'badge', value: 'Low' },
      { kind: 'link', label: 'View Details', href: '#' },
    ],
    [
      { kind: 'status', value: 'green' },
      'Full Name',
      '12th August 2025',
      '12:45 PM',
      { kind: 'badge', value: 'High' },
      { kind: 'link', label: 'View Details', href: '#' },
    ],
    [
      { kind: 'status', value: 'green' },
      'Full Name',
      '12th August 2025',
      '12:45 PM',
      { kind: 'badge', value: 'High' },
      { kind: 'link', label: 'View Details', href: '#' },
    ],
    [
      { kind: 'status', value: 'orange' },
      'Full Name',
      '12th August 2025',
      '12:45 PM',
      { kind: 'badge', value: 'Low' },
      { kind: 'link', label: 'View Details', href: '#' },
    ],
    [
      { kind: 'status', value: 'red' },
      'Full Name',
      '12th August 2025',
      '12:45 PM',
      { kind: 'badge', value: 'Standard' },
      { kind: 'link', label: 'View Details', href: '#' },
    ],
    [
      { kind: 'status', value: 'red' },
      'Full Name',
      '12th August 2025',
      '12:45 PM',
      { kind: 'badge', value: 'Critical' },
      { kind: 'link', label: 'View Details', href: '#' },
    ],
    [
      { kind: 'status', value: 'green' },
      'Full Name',
      '12th August 2025',
      '12:45 PM',
      { kind: 'badge', value: 'High' },
      { kind: 'link', label: 'View Details', href: '#' },
    ],
  ];

  return (
    <div className=''>
      <div className='px-6 py-4'>
        <h3 className='text-xl font-semibold text-gray-900'>Branch Shifts</h3>
      </div>
      <Table headers={headers} data={rows} />
    </div>
  );
}
