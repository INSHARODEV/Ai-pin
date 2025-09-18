'use client';

import { useEffect, useState } from 'react';
import Modal from '@/components/ui/Modal';

export default function EditBranchInfoModal({
  open,
  onClose,
  initial,
  onUpdate,
}: {
  open: boolean;
  onClose: () => void;
  initial: { name: string; supervisor: string; email: string } | null;
  onUpdate: (d: { name: string; supervisor: string; email: string }) => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [supervisor, setSupervisor] = useState(initial?.supervisor ?? '');
  const [email, setEmail] = useState(initial?.email ?? '');

  useEffect(() => {
    setName(initial?.name ?? '');
    setSupervisor(initial?.supervisor ?? '');
    setEmail(initial?.email ?? '');
  }, [open, initial]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title='Edit branch info'
      maxWidthClass='max-w-lg'
    >
      <div className='space-y-4'>
        <div>
          <label className='mb-1 block text-sm text-gray-500'>
            Branch Name
          </label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Branch Name'
          />
        </div>
        <div>
          <label className='mb-1 block text-sm text-gray-500'>
            Supervisor Name
          </label>
          <input
            value={supervisor}
            onChange={e => setSupervisor(e.target.value)}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Supervisor Name'
          />
        </div>
        <div>
          <label className='mb-1 block text-sm text-gray-500'>
            Supervisor Email
          </label>
          <input
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            className='w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='name@company.com'
          />
        </div>
      </div>

      <div className='mt-6 flex justify-end gap-2'>
        <button
          onClick={onClose}
          className='rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700'
        >
          Cancel
        </button>
        <button
          onClick={() => {
            onUpdate({ name, supervisor, email });
            onClose();
          }}
          className='rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white'
        >
          Update
        </button>
      </div>
    </Modal>
  );
}
