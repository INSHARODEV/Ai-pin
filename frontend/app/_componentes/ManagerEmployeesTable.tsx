'use client';

import * as React from 'react';
import Link from 'next/link';
import Table, { type TableCell } from './reusable/Table';
import EmptyState from './EmptyState'; // ← import your empty state
import { MakeApiCall, Methods } from '../actions';

type StatusColor = 'green' | 'orange' | 'red';
type PerfLabel = 'High' | 'Average' | 'Critical' | 'Standard' | 'Low';

export interface ManagerEmployeeRow {
  id: string;
  fullName: string;
  branchName: string;
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

export default function ManagerEmployeesTable({
  emptyMessage,
  open,
  setOpen,
}: Props) {
  const [companyId, setcompanyId] = React.useState('');
  const [userId, setuserId] = React.useState('');
  const [employees, setEmployees] = React.useState([]);
  const [v, setBranch] = React.useState([]);
  const [numberOfPages,setNumberOfPages]=React.useState(1)
  const [page,setpage]=React.useState(1)
  const headers = [
    'Status',
    'Employee Name',
    'Branch',
    'Last Active',
    'Shift Performance',
    'Details',
  ];
  React.useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData._id) {
          setuserId(userData._id);
          // Also set companyId if it exists in user data
          if (userData.companyId) {
            setcompanyId(userData.companyId);
          }
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);
  React.useEffect(() => {
    async function getCompany() {
      if (!userId) return; // Null check for userId
      
      try {
        const  data 
          = await MakeApiCall({
          method: Methods.GET,
          url: `/company/${userId}/comapny`, // Using userId instead of hardcoded ID
        });
        if(!data._id) return
        setNumberOfPages(numberOfPages)
        setpage(page)
        setcompanyId(data._id);
        setBranch(data.branchs);
        console.log('branches only', data.branchs);
      } catch (error) {
        console.error('Error fetching company:', error);
      }
    }

    getCompany();
  }, [userId]); // Dependency on userId



  React.useEffect(() => {
    
    async function getAllEmployees() {
      console.log('companyId',companyId)
      if (!companyId) return; // Null check for companyId
      
      try {
        // Get all branches for the company (branches contain salesData with employees)
        const branchesRes = await MakeApiCall({
          method: Methods.GET,
          url: `/branch/${companyId}`,
        });
        async function getPerformance(id: string) {
          const res = await MakeApiCall({ url: `/shift/${id}`, method: Methods.GET });
        
          if (!res || !Array.isArray(res.transcriptionsId) || res.transcriptionsId.length === 0) {
            return 0; // no data → 0 performance
          }
        
          // Sum all performances
          const total = res.transcriptionsId.reduce(
            (sum: number, item: any) => sum + (item.performance ?? 0),
            0
          );
        
          // Average
          const avg = total / res.transcriptionsId.length;
        
          // Ensure in 1–100 range
          const normalized = Math.max(1, Math.min(100, Math.round(avg)));
        
          console.log("Employee Performance:", normalized);
        
          return normalized;
        }
        console.log('Branches responsesssss:', branchesRes);
        
        if (branchesRes.data && Array.isArray(branchesRes.data)) {
          // Extract all employees from salesData of each branch and transform to ManagerEmployeeRow format
          const allEmployees = branchesRes.data.flatMap((branch: any) => {
            const branchEmployees = branch.salesData || [];
          
            return branchEmployees.map((employee: any) => ({
              id: employee.salllerId || employee.id || '',
              fullName: employee.name || '',
              branchName: branch.name || 'Unknown Branch',
              lastActive: branchesRes.data.lastActive || undefined,
              lastActiveDate: employee.lastActiveDate || undefined,
              lastActiveTime: employee.lastActiveTime || undefined,
              performance: getPerformance(employee.salllerId)||undefined,
              status: employee.status || undefined
            }));
          });
          
          console.log('All employees transformed:', allEmployees);
          setEmployees(allEmployees);
        } else {
          console.log('No branches found or branches data is not an array');
          setEmployees([]);
        }
      } catch (error) {
        console.error('Error fetching employees:', error);
        setEmployees([]);
      }
    }

    getAllEmployees();
  }, [companyId]); // Dependency on companyId
  const list = Array.isArray(employees) ? employees as any : [];
  const rows: TableCell[][] = list.map((e:any) => {
    const perfLabel = toPerfLabel(e.performance);
    const status = e.status ?? statusFromPerf(perfLabel);
    const lastActive =
      e.lastActive ??
      [e.lastActiveDate, e.lastActiveTime].filter(Boolean).join(', ');

    return [
      { kind: 'status', value: status },
      e.fullName,
      e.branchName,
      lastActive,
      { kind: 'badge', value: perfLabel },
      <Link
        key={e.id}
        href={`/branch/employees/${e.id}`}
        className='text-blue-600 hover:underline'
      >
        View Profile
      </Link>,
    ];
  });

  // Default empty state (when parent doesn't provide one)
  const fallbackEmpty = emptyMessage ?? (
    <EmptyState
      image='/file-not-found.svg'
      title='Nothing Found!'
      message='No employees added yet! Add your employees and start tracking.'
      ctaLabel='Add employee'
      onCtaClick={() => setOpen(true)}
    />
  );

  return <Table headers={headers} data={rows} emptyMessage={fallbackEmpty}  numberOfPages={numberOfPages} page={1} setPage={1}/>;
}
