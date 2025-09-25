// app/_componentes/SalesTable.tsx
import * as React from 'react';
import Table, { type TableCell } from './reusable/Table';

export type SalesRow = {
  id: string;
  name: string; // employee name
  dateJoined: any;
  branch: string;
  email: string;
  salllerId?:any
};

// export function formatDateLong(date: Date) {
//   return new Intl.DateTimeFormat('en-GB', {
//     day: '2-digit',
//     month: 'long',
//     year: 'numeric',
//   }).format(date);
// }

export function SalesTable({
  rows,
  onEdit,
  onDelete,
}: {
  rows: SalesRow[];
  onEdit: (row: SalesRow) => void;
  onDelete: (row: SalesRow) => void;
}) {
  const headers = [
    'Sales',
    'Date Joined',
    'Branch',
    'Sales Email',
    'Edit',
    'Delete',
  ];

  const data: TableCell[][] = rows.map(r => [
    r.name,
   typeof  r.dateJoined ==='string' ?r.dateJoined :r.dateJoined.toIsString ,
    r.branch,
    r.email,
    <button
      key={`edit-${r.id}`}
      onClick={() => onEdit(r)}
      className='text-blue-600 hover:underline'
      type='button'
    >
      Edit Info
    </button>,
    <button
      key={`del-${r.id}`}
      //#TOTD ADD THE DELETE
      onClick={() => onDelete(r)}
      className='text-red-600 hover:text-red-700'
      type='button'
      aria-label={`Delete ${r.name}`}
      title='Delete'
    >
      {/* trash */}
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-4 w-4'
        viewBox='0 0 24 24'
        fill='currentColor'
      >
        <path d='M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9z' />
      </svg>
    </button>,
  ]);

  return <Table headers={headers} data={data} />;
}
