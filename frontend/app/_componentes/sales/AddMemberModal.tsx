'use client';

import * as React from 'react';
import Modal from '@/components/ui/Modal';

export default function AddMemberModal({
  open,
  onClose,
  branches,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  branches: any[]
  onSubmit: (data: {
    id: any,
    branch: string;
    name: string;
    email: string;
  }) => Promise<void> | void;
}) {
  const [selectedBranchId, setSelectedBranchId] = React.useState('');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  React.useEffect(() => {
    if (!open) {
      setSelectedBranchId('');
      setName('');
      setEmail('');
    }
  }, [open]);

  // Get the selected branch object to display the branch name
  const selectedBranch = branches.find(b => b.id === selectedBranchId);

  const handleSubmit = async () => {
    if (!selectedBranchId || !selectedBranch) {
      alert('Please select a branch');
      return;
    }
    
    await onSubmit({
      id: selectedBranchId,
      branch: selectedBranch.branch, // branch name
      name,
      email
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Add new member'
      maxWidthClass='max-w-lg'
    >
      <p className='mb-4 text-sm text-gray-600'>
        Write all the details and we'll send them an email with their initial
        password.
      </p>

      <div className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm text-gray-500'>
            Branch Name
          </label>
          <select
            value={selectedBranchId}
            onChange={e => setSelectedBranchId(e.target.value)}
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            <option value="">Select a branch...</option>
            {branches.map((b: any) => (
              <option key={b.id} value={b.id}>
                
                {b. branch || ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-500'>
            Employee Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Name'
          />
        </div>

        <div>
          <label className='mb-1 block text-sm text-gray-500'>Email</label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='name@company.com'
          />
        </div>
      </div>

      <div className='mt-6 flex justify-end'>
        <button
          onClick={handleSubmit}
          disabled={!selectedBranchId || !name || !email}
          className='rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white disabled:bg-gray-400'
        >
          Done
        </button>
      </div>
    </Modal>
  );
}