// components/CompaniesTable.tsx
import * as React from 'react';
import Table, { type TableCell } from './reusable/Table';

export type Company = {
  id: string;
  name: string;
  dateJoined: Date;
  manager: string;
  branches: number;
  sales: number;
};

function formatDateLong(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function CompaniesTable({ rows }: { rows: Company[] }) {
  const headers = [
    'Company',
    'Date Joined',
    'Manager',
    'Branches Number',
    'Sales Number',
    'Details',
  ];

  const data: TableCell[][] = rows.map(c => [
    c.name,
    formatDateLong(c.dateJoined),
    c.manager,
    c.branches,
    c.sales,
    { kind: 'link', label: 'View details', href: `/admin/companies/${c.id}` },
  ]);

  return <Table headers={headers} data={data} />;
}
