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
  const [success, setSuccess] = React.useState(false);
  const [branchs, setBranchs] = useState([]);
  const [page, setPage] = useState(0);
  const [companyId, setcompanyId] = React.useState('');

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
        setBranchs(res?.data ?? []);
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

    // Refresh the branches list after adding a new branch
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