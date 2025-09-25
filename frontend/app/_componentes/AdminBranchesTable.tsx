// app/_componentes/AdminBranchesTable.tsx
import * as React from 'react';
import Table, { type TableCell } from './reusable/Table';

export type BranchRow = {
  id: string;
  name: string;
  dateCreated: Date;
  supervisor: string;
  sales: number;
  companyId?: string;
};

function formatDateLong(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function AdminBranchesTable({ rows }: { rows: BranchRow[] }) {
  const headers = [
    'Branch',
    'Date Created',
    'Supervisor',
    'Sales Number',
    'Details',
  ];

  console.log(rows);
  const data: TableCell[][] = rows.map(b => [
    b.name,
    formatDateLong(b.dateCreated),
    b.supervisor,
    b.sales,
    {
      kind: 'link',
      label: 'View details',
      href: `/admin/companies/${b.companyId ?? ''}/branches/${b.id}`,
    },
  ]);

  return <Table headers={headers} data={data} />;
}
