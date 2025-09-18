// components/sales/EditEmployeeModal.tsx
'use client';

import * as React from 'react';
import Modal from '@/components/ui/Modal';

export default function EditEmployeeModal({
  open,
  onClose,
  branches,
  initial,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  branches: string[];
  initial: { branch: string; name: string; email: string } | null;
  onUpdate: (data: {
    branch: string;
    name: string;
    email: string;
  }) => Promise<void> | void;
}) {
  const [branch, setBranch] = React.useState(initial?.branch ?? '');
  const [name, setName] = React.useState(initial?.name ?? '');
  const [email, setEmail] = React.useState(initial?.email ?? '');

  React.useEffect(() => {
    setBranch(initial?.branch ?? branches[0] ?? '');
    setName(initial?.name ?? '');
    setEmail(initial?.email ?? '');
  }, [open, initial, branches]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Edit Employee'
      maxWidthClass='max-w-lg'
    >
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
            await onUpdate({ branch, name, email });
          }}
          className='rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white'
        >
          Update
        </button>
      </div>
    </Modal>
  );
}
