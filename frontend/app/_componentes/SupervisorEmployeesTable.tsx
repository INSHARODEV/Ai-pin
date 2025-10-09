'use client';

import * as React from 'react';
import Link from 'next/link';
import Table, { type TableCell } from './reusable/Table';
import EmptyState from './EmptyState';

type StatusColor = 'green' | 'orange' | 'red';
type PerfLabel = 'High' | 'Average' | 'Critical' | 'Standard' | 'Low';
import { useEffect } from 'react';
import { MakeApiCall, Methods } from '../actions';

export interface SupervisorEmployeeRow {
  id: string;
  fullName: string;
  lastActive?: string;
  lastActiveDate?: string;
  lastActiveTime?: string;
  performance: number | PerfLabel;
  status?: StatusColor;
}

interface Props {
   emptyMessage?: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const toPerfLabel = (p: number | PerfLabel): PerfLabel =>
  typeof p === 'number'
    ? p === 0
      ? 'Critical'
      : p > 80
        ? 'High'
        : 'Average'
    : (p as PerfLabel);

const statusFromPerf = (label: PerfLabel): StatusColor =>
  label === 'High' ? 'green' : label === 'Critical' ? 'red' : 'orange';

export default function SupervisorEmployeesTable({
  emptyMessage,
  open,
  setOpen,
}: Props) {
  const [emps, setEmps] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    async function getAllEmployees() {
      setLoading(true);
      
      try {
        const user = JSON.parse(localStorage?.getItem('user') || '{}');
        const branchId = user?.branchId;
        
        if (!branchId) {
          console.error('No branchId found in user data');
          setEmps([]);
          setLoading(false);
          return;
        }

        // Get branch data with sellers
        const branchRes = await MakeApiCall({
          method: Methods.GET,
          url: `/branch/branch/${branchId}`,
        });

        // Get all shifts data for the branch
        const shiftsRes = await MakeApiCall({
          method: Methods.GET,
          url: `/shift?branchId=${branchId}`, // Adjust endpoint as needed
        });

        console.log('Branch response:', branchRes);
        console.log('Shifts response:', shiftsRes);

        if (!branchRes || !branchRes) {
          console.log('No sellers found in branch');
          setEmps([]);
          setLoading(false);
          return;
        }

        const sellers = branchRes.sellers
        const shiftsData = shiftsRes.data || [];

        // Transform sellers to employee rows
        const allEmployees = sellers.map((seller: any) => {
          // Find all shifts for this employee
          const employeeShifts = shiftsData.filter(
            (shift: any) => shift.empId === seller._id
          );

          // Get the most recent shift for lastActive
          const latestShift = employeeShifts.sort((a: any, b: any) => {
            return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
          })[0];

          // Calculate average performance across all shifts
          let avgPerformance = 0;
          if (employeeShifts.length > 0) {
            const totalPerf = employeeShifts.reduce(
              (sum: number, shift: any) => sum + (shift.performance || 0),
              0
            );
            avgPerformance = Math.round(totalPerf / employeeShifts.length);
          }

          return {
            id: seller._id,
            fullName: `${seller.firstName || ''} ${seller.lastName || ''}`.trim() || seller.email,
            branchName: branchRes.name || 'Unknown Branch',
            lastActive: latestShift?.lastActive || 'Never',
            lastActiveDate: latestShift?.date || undefined,
            lastActiveTime: latestShift?.startTime || undefined,
            performance: avgPerformance,
            status: undefined // Will be derived from performance
          };
        });

        console.log('All employees transformed:', allEmployees);
        setEmps(allEmployees);
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmps([]);
      } finally {
        setLoading(false);
      }
    }

    getAllEmployees();
  }, []);

  const headers = [
    'Status',
    'Employee Name',
    'Last Active',
    'Shift Performance',
    'Details',
  ];

  const list = Array.isArray(emps) ? emps : [];
  const rows: TableCell[][] = list.map(e => {
    const perfLabel = toPerfLabel(e.performance);
    const status = e.status ?? statusFromPerf(perfLabel);

    return [
      { kind: 'status', value: status },
      e.fullName,
      e.lastActive || 'N/A',
      { kind: 'badge', value: perfLabel },
      <Link
        key={e.id}
        href={`/employee-profile/${e.id}`}
        className='text-blue-600 hover:underline'
      >
        View Profile
      </Link>,
    ];
  });

  // Show loading state
  if (loading) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-600">Loading employees...</p>
      </div>
    );
  }

  // Default empty state
  const fallbackEmpty = emptyMessage ?? (
    <EmptyState
      image='/file-not-found.svg'
      title='Nothing Found!'
      message='No employees added yet! Add your employees and start tracking.'
      ctaLabel='Add employee'
      onCtaClick={() => setOpen(true)}
    />
  );

  return <Table headers={headers} data={rows} emptyMessage={fallbackEmpty} />;
}