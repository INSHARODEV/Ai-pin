'use client';

import React from 'react';
import { useShiftsContext } from '../layout';
import ManagerEmployeesTable from '@/app/_componentes/ManagerEmployeesTable';
import SupervisorEmployeesTable from '@/app/_componentes/SupervisorEmployeesTable';
import EmployeesToolbar from '@/app/_componentes/employees/EmployeesToolbar';
import AddEmployeeButton from '@/app/_componentes/employees/AddEmployeeButton';

function Page() {
  const { user } = useShiftsContext();
  const [open, setOpen] = React.useState(false);

  const userRole = user?.role;
  const emps: any = [];
  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold text-gray-800'>Employees</h1>
        <AddEmployeeButton open={open} setOpen={setOpen} />
      </div>
      <EmployeesToolbar
        onChange={state => {
          // Optional: wire to your table/filter logic later
          // console.log('toolbar state', state);
        }}
      />
      {userRole === 'SUPERVISOR' && (
        <SupervisorEmployeesTable
          open={open}
          setOpen={setOpen}
          employees={emps ?? []}
        />
      )}
      {(userRole === 'MANAGER' || userRole === 'ADMIN') && (
        <ManagerEmployeesTable
          open={open}
          setOpen={setOpen}
          employees={emps ?? []}
        />
      )}
    </div>
  );
}

export default Page;
