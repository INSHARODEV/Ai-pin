'use client';

import React, { useEffect } from 'react';
import { useShiftsContext } from '../layout';
import ManagerEmployeesTable from '@/app/_componentes/ManagerEmployeesTable';
import SupervisorEmployeesTable from '@/app/_componentes/SupervisorEmployeesTable';
import EmployeesToolbar from '@/app/_componentes/employees/EmployeesToolbar';
import AddEmployeeButton from '@/app/_componentes/employees/AddEmployeeButton';
import { MakeApiCall, Methods } from '@/app/actions';
import AddEmployeeButtonDireclty from '@/app/_componentes/employees/addDIrectly';
 
function Page() {
  const { user } = useShiftsContext();
  const [open, setOpen] = React.useState(false);

  
  // Get user ID from localStorage

 
  const userRole = user?.role;

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold text-gray-800'>Employees</h1>
        <AddEmployeeButtonDireclty open={open} setOpen={setOpen}  />
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
         
        />
      )}
      {(userRole === 'MANAGER' || userRole === 'ADMIN') && (
        <ManagerEmployeesTable
          open={open}
          setOpen={setOpen}
      
        />
      )}
    </div>
  );
}

export default Page;