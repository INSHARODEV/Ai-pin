'use client';

import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';

import { useShiftsContext } from '@/app/branch/layout';
import AddEmployeeModal from './AddEmployeeModal';
import AddEmployeeSuccess from './AddEmployeeSuccess';
import { MakeApiCall, Methods } from '@/app/actions';

interface AddEmployeeButtonProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddEmployeeButton({
  open,
  setOpen,
}: AddEmployeeButtonProps) {
  const { user, emps } = useShiftsContext();
  const role = user?.role as
    | 'MANAGER'
    | 'ADMIN'
    | 'SUPERVISOR'
    | 'SELLER'
    | undefined;
const[branchs,setBrancs]=useState([] as any)
 
  useEffect(()=>{
 
    async function getData(){

      const {branchs}=await MakeApiCall({url:`/company/${user._id}/comapny`,method:Methods.GET})
      
      setBrancs(branchs.map(b=>{return{name:b.name,_id:b._id}}))
      console.log('alllllllllll',branchs.map(b=>{return{name:b.name,_id:b._id}}))
    }

    getData()
  },[])

  const [success, setSuccess] = React.useState<null | {
    name: string;
    email: string;
  }>(null);

  return (
    <>
      <button
        type='button'
        onClick={() => setOpen(true)}
        className='inline-flex items-center gap-2 rounded-xl bg-[#0D70C8] px-4 py-2 text-white hover:bg-[#0D70B8] transition'
      >
        Add employee <Plus className='h-4 w-4' />
      </button>

      {/* Create modal */}
      <AddEmployeeModal
        isOpen={open}
        role={role}
        branches={branchs}
        defaultBranch={user?.branchName}
        onClose={() => setOpen(false)}
        onSuccess={async payload => {
          const submittedData = {
            firstName: payload.name,
            email: payload.email?.toLowerCase(),
            role: "SELLER",
            jobTitle: "Employee",
            password: "changeMe",
            branchId:payload.branchId,
          };
       
      
          console.log("Submitting:", submittedData);
      
          await MakeApiCall({
            method: Methods.POST,
            url: `/auth`,
            body: JSON.stringify(submittedData),
            headers: "json",
          });
          setOpen(false);
          setSuccess({ name: payload.name, email: payload.email });
        }}
      />

      {/* Success modal */}
      <AddEmployeeSuccess
        isOpen={!!success}
        onClose={() => setSuccess(null)}
        onAddAnother={() => {
          setSuccess(null);
          setOpen(true);
        }}
      />
    </>
  );
}
