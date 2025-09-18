// components/sales/AddMemberModal.tsx
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
  branches: string[];
  onSubmit: (data: {
    branch: string;
    name: string;
    email: string;
  }) => Promise<void> | void;
}) {
  const [branch, setBranch] = React.useState(branches[0] ?? 'All Branches');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');

  React.useEffect(() => {
    if (!open) {
      setBranch(branches[0] ?? 'All Branches');
      setName('');
      setEmail('');
    }
  }, [open, branches]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Add new member'
      maxWidthClass='max-w-lg'
    >
      <p className='mb-4 text-sm text-gray-600'>
        Write all the details and we’ll send them an email with their initial
        password.
      </p>

      <div className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm text-gray-500'>
            Branch Name
          </label>
          <select
            value={branch}
            onChange={e => setBranch(e.target.value)}
            className='w-full rounded-lg border border-gray-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            {branches.map(b => (
              <option key={b} value={b}>
                {b}
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
          onClick={async () => {
            await onSubmit({ branch, name, email });
          }}
          className='rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white'
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
