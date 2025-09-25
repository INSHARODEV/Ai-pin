'use client';

import React, { useEffect, useState } from 'react';
import BranchesToolbar from '@/app/_componentes/branches/BranchesToolbar';
import AddBranchButton from '@/app/_componentes/branches/AddBranchButton';
import AddBranchModal, {
  type AddBranchPayload,
} from '@/app/_componentes/branches/AddBranchModal';
import BranchAddedSuccessModal from '@/app/_componentes/branches/BranchAddedSuccessModal';

import ManagerBranchesTable, {
  type ManagerBranchRow,
} from '@/app/_componentes/ManagerBranchesTable';
import { MakeApiCall, Methods } from '@/app/actions';
import { Role } from '../../../../shard/src';

export default function Page() {
  const [open, setOpen] = React.useState(false);
  const [userId, setuserId] = React.useState('');
  const [branch, setBranch] = React.useState('');
  const [companyId, setcompanyId] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [branchs, setBranchs] = useState([]);
  const [page, setPage] = useState(0);

  // Get user ID from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData && userData._id) {
          setuserId(userData._id);
        }
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error);
      }
    }
  }, []);

  // Fetch company data when userId is available
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

  // Fetch branches list when companyId is available
  useEffect(() => {
    async function getBranchList() {
      if (!companyId) return; // Null check for companyId
      
      try {
        const res = await MakeApiCall({
          method: Methods.GET,
          url: `/branch/${companyId}`,
        });

        console.log('Branch list response:', res);
        
        // Fixed shifts call - added missing & and removed extra brace
        if (res?.data && res.data.length > 0) {
          const shifts = await Promise.all(res.data.map(async (b) => {
            // Added null check for b.id
            if (!b.id) {
              console.warn('Branch ID is undefined for branch:', b);
              return { branch: b, shifts: null };
            }
            
            try {
              const shiftData = await MakeApiCall({
                method: Methods.GET,
                url: `/shift?branchId=${b.id}&limit=100000&order=desc`, // Get all shifts for performance calculation
              });
              return { branch: b, shifts: shiftData };
            } catch (error) {
              console.error(`Error fetching shifts for branch ${b.id}:`, error);
              return { branch: b, shifts: null };
            }
          }));
          
          // Calculate performance for each branch and add it to branch object
          const branchesWithPerformance = shifts.map(({ branch, shifts: shiftData }) => {
            let totalPerformance = 0;
            let shiftCount = 0;
            let changes = 0; // Default change value
            
            if (shiftData?.data && Array.isArray(shiftData.data)) {
              // Sort shifts by date/time to ensure proper order (most recent first)
              const sortedShifts = [...shiftData.data].sort((a, b) => {
                // Assuming the API returns shifts in chronological order, but sorting to be safe
                return new Date(b.date).getTime() - new Date(a.date).getTime();
              });
              
              // Sum up all performance values from shifts
              sortedShifts.forEach(shift => {
                if (typeof shift.performance === 'number') {
                  totalPerformance += shift.performance;
                  shiftCount++;
                }
              });
              
              // Calculate changes based on last shift vs previous 7 shifts average
              if (sortedShifts.length >= 2) {
                const lastShift = sortedShifts[0]; // Most recent shift
                const previousShifts = sortedShifts.slice(1, 8); // Previous 7 shifts (or less if not enough data)
                
                if (previousShifts.length > 0) {
                  // Calculate average of previous shifts
                  const previousTotal = previousShifts.reduce((sum, shift) => {
                    return sum + (typeof shift.performance === 'number' ? shift.performance : 0);
                  }, 0);
                  const previousAvg = previousTotal / previousShifts.length;
                  
                  // Compare last shift performance with previous average
                  const lastShiftPerformance = typeof lastShift.performance === 'number' ? lastShift.performance : 0;
                  
                  if (lastShiftPerformance > previousAvg) {
                    changes = 1; // Upward trend
                  } else if (lastShiftPerformance < previousAvg) {
                    changes = -1; // Downward trend
                  } else {
                    changes = 0; // No change
                  }
                  
                  console.log(`Branch ${branch.name || branch.id}: Last shift: ${lastShiftPerformance}, Previous avg: ${previousAvg.toFixed(2)}, Change: ${changes}`);
                }
              }
            }
            
            // Calculate average performance or set to 0 if no shifts
            const averagePerformance = shiftCount > 0 ? totalPerformance / shiftCount : 0;
            
            // Add performance and changes fields to branch
            return {
              ...branch,
              performance: averagePerformance,
              totalShifts: shiftCount,
              changes: changes // 1 for up, -1 for down, 0 for no change
            };
          });
          
          console.log('Branches with performance:', branchesWithPerformance);
          setBranchs(branchesWithPerformance as any);
          
          // Log first branch's shifts data for debugging
          if (shifts[0]?.shifts?.data) {
            console.log('Shifts data:', shifts[0].shifts.data);
          }
        } else {
          setBranchs(res?.data ?? []);
        }
        
        setPage(res?.numberOfPages ?? 0);
      } catch (error) {
        console.error('Error fetching branch list:', error);
      }
    }

    getBranchList();
  }, [companyId]); // Dependency on companyId

  const handleSubmit = async (data: any) => {
    console.log('ddd', data);
        
    const submittedData = {
      name: data.name,
      Superviosr: {
        "firstName": data.name,
        email: data.email?.toLowerCase(),
        "role": "Superviosr"
      }
    };
      
    console.log(submittedData);
    const res = await MakeApiCall({  
      method: Methods.POST,
      url: `/branch/${companyId}`,
      body: JSON.stringify(submittedData),
      headers: 'json'
    });

    const { members } = data;
    let body = members.map((mem: any) => {
      return {
        firstName: mem.name,
        email: mem.email,
        password: '$argon2id$v=19$m=65536,t=3,p=4$vY0JEqNe0/leVDsj38qQmg$64uOvXZa8/JqhZOajVXkMvpDGXe11y0lPG20oor7D0I',
        role: Role.SELLER,
        branchId: res._id,
        jobTitle: 'Employee'
      };
    });

    console.log('body', body);
    await MakeApiCall({
      method: Methods.POST,
      url: `/auth`,
      body: JSON.stringify(body),
      headers: "json",
    });

     
    const updatedRes = await MakeApiCall({
      method: Methods.GET,
      url: `/branch/${companyId}`,
    });
    setBranchs(updatedRes?.data ?? []);
    setPage(updatedRes?.numberOfPages);

    setSuccess(true); // Show success modal
    setOpen(false); // Close the add branch modal

  };

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold text-gray-800'>Branches</h1>
        <AddBranchButton onClick={() => setOpen(true)} />
      </div>

      <BranchesToolbar onChange={() => {}} />

      <ManagerBranchesTable branches={branchs} open={open} setOpen={setOpen} />

      {/* Modals */}
      <AddBranchModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
      />

      <BranchAddedSuccessModal
        open={success}
        onClose={() => setSuccess(false)}
        onAddAnother={() => {
          setSuccess(false);
          setOpen(true);
        }}
      />
    </div>
  );
}