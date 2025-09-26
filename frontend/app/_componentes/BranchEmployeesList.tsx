'use client';

import Link from 'next/link';
import React, { useEffect } from 'react';

type StatusColor = 'green' | 'orange' | 'red' | 'gray';

export interface BranchEmployeeItem {
  id: string;
  name: string;
  email: string;
  status: StatusColor;
}

const dot = (c: StatusColor) => {
  const map: Record<StatusColor, string> = {
    green: 'bg-green-500',
    orange: 'bg-amber-500',
    red: 'bg-rose-500',
    gray: 'bg-gray-400',
  };
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${map[c]}`} />;
};

export default function BranchEmployeesList({
  employees,
}: {
  employees: BranchEmployeeItem[];
}) {
  useEffect(()=>{

    console.log('employees',employees)
    
    },[])
  return (
    <div className='space-y-3'>
      {employees.map(e => (
        <div
          key={e.id}
          className='flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3'
        >
          <div>
            <div className='flex items-center gap-2 text-gray-900'>
              <span className='font-medium'>{e.name}</span>
              {dot(e.status)}
            </div>
            <div className='text-xs text-gray-500'>{e.email}</div>
          </div>
          <Link
            href={`/employee-profile/${e.id}`}
            className='text-blue-600 hover:underline text-sm'
          >
            View
          </Link>
        </div>
      ))}
    </div>
  );
}
