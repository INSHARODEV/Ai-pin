'use client';

import React from 'react';
import { Plus } from 'lucide-react';

import { useShiftsContext } from '@/app/branch/layout';
import AddEmployeeModal from './AddEmployeeModal';
import AddEmployeeSuccess from './AddEmployeeSuccess';
import AddEmployeeModalDirectly from './addempmde';

interface AddEmployeeButtonProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AddEmployeeButtonDireclty({
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

  // Derive branch list from context if available
 

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
      <AddEmployeeModalDirectly  
     
        isOpen={open}
        role={role}
       
       
        onClose={() => setOpen(false)}
        onSuccess={payload => {
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
