// components/CompaniesTable.tsx
import * as React from 'react';
import Table, { type TableCell } from './reusable/Table';
import {useEffect} from 'react'
import { Branch } from '../../../shard/src';
export type Company = {
  id: string;
  companyName: string;
  dateJoined: Date;
  managerName : string;
  managerEmail : string;
  branches: any;
  sales: number;
};



function formatDateLong(date: Date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(d);
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
 useEffect(()=>{console.log('rows',rows)},[])
  const data: TableCell[][] = rows.map(c => [
    c.companyName,
    formatDateLong(c.dateJoined),
    c.managerName,
    c.branches,
    c.sales,
    { kind: 'link', label: 'View details', href: `/admin/companies/${c.id}` },
  ]);

  return <Table headers={headers} data={data} />;
}
