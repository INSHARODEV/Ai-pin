'use client';

import React from 'react';
import BranchesToolbar from '@/app/_componentes/branches/BranchesToolbar';
import AddBranchButton from '@/app/_componentes/branches/AddBranchButton';
import AddBranchModal, {
  type AddBranchPayload,
} from '@/app/_componentes/branches/AddBranchModal';
import BranchAddedSuccessModal from '@/app/_componentes/branches/BranchAddedSuccessModal';

import ManagerBranchesTable, {
  type ManagerBranchRow,
} from '@/app/_componentes/ManagerBranchesTable';

export default function Page() {
  const [open, setOpen] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  // TODO: replace with real data
  const branches: ManagerBranchRow[] = [];

  const handleSubmit = async (payload: AddBranchPayload) => {
    // TODO: call your API here
    // await fetch('/api/branches', { method: 'POST', body: JSON.stringify(payload) });
    setSuccess(true);
  };

  return (
    <div className='flex flex-col gap-6 p-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold text-gray-800'>Branches</h1>
        <AddBranchButton onClick={() => setOpen(true)} />
      </div>

      <BranchesToolbar onChange={() => {}} />

      <ManagerBranchesTable branches={branches} open={open} setOpen={setOpen} />

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
