'use client';

import React, { useEffect } from 'react';
import { useShiftsContext } from '../layout';
import ManagerEmployeesTable from '@/app/_componentes/ManagerEmployeesTable';
import SupervisorEmployeesTable from '@/app/_componentes/SupervisorEmployeesTable';
import EmployeesToolbar from '@/app/_componentes/employees/EmployeesToolbar';
import AddEmployeeButton from '@/app/_componentes/employees/AddEmployeeButton';
import { MakeApiCall, Methods } from '@/app/actions';

function Page() {
  const { user } = useShiftsContext();
  const [open, setOpen] = React.useState(false);
  const [companyId, setcompanyId] = React.useState('');
  const [userId, setuserId] = React.useState('');
  const [employees, setEmployees] = React.useState([]);
  const [v, setBranch] = React.useState([]);
  
  // Get user ID from localStorage
  useEffect(() => {
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
  useEffect(() => {
    async function getCompany() {
      if (!userId) return; // Null check for userId
      
      try {
        const res = await MakeApiCall({
          method: Methods.GET,
          url: `/company/${userId}/comapny`, // Using userId instead of hardcoded ID
        });
        setcompanyId(res._id);
        setBranch(res.branchs);
        console.log('branches only', res.branchs);
      } catch (error) {
        console.error('Error fetching company:', error);
      }
    }

    getCompany();
  }, [userId]); // Dependency on userId



  useEffect(() => {
    async function getAllEmployees() {
      if (!companyId) return; // Null check for companyId
      
      try {
        // Get all branches for the company (branches contain salesData with employees)
        const branchesRes = await MakeApiCall({
          method: Methods.GET,
          url: `/branch/${companyId}`,
        });
        
        console.log('Branches response:', branchesRes);
        
        if (branchesRes.data && Array.isArray(branchesRes.data)) {
          // Extract all employees from salesData of each branch and transform to ManagerEmployeeRow format
          const allEmployees = branchesRes.data.flatMap((branch: any) => {
            const branchEmployees = branch.salesData || [];
            
            return branchEmployees.map((employee: any) => ({
              id: employee.salllerId || employee.id || '',
              fullName: employee.name || '',
              branchName: branch.name || 'Unknown Branch',
              lastActive: employee.lastActive || undefined,
              lastActiveDate: employee.lastActiveDate || undefined,
              lastActiveTime: employee.lastActiveTime || undefined,
              performance: employee.performance || 0,
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
  const userRole = user?.role;

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
          employees={employees ?? []}
        />
      )}
      {(userRole === 'MANAGER' || userRole === 'ADMIN') && (
        <ManagerEmployeesTable
          open={open}
          setOpen={setOpen}
          employees={employees ?? []}
        />
      )}
    </div>
  );
}

export default Page;