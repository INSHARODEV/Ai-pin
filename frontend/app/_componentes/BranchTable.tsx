// components/BranchTable.tsx
import * as React from 'react';
import Table, { type TableCell } from './reusable/Table';
import { Shift } from '../types';
import Link from 'next/link';
interface props{
  shifst:Shift[]
}
export default function BranchTable({shifst}:props) {
  const headers = [
    'Name',
    'Date',
    'Time',
    'Shift Performance',
    'Details',
  ];

    const rows: TableCell[][] = shifst.map((shift) => [
    shift.fullName,
    shift.date,
    shift.startTime,
    {
      kind: "badge",
      value:
        shift.performance === 0
          ? "Low"
          : shift.performance > 80
          ? "High"
          : "Standard",
    }
    ,<Link  href={`/employee-rpofile/${shift.empId}`} >Details</Link>
  ]);

  return<>
  <Table headers={headers} data={rows} /> 

  
  </> 
 
}
