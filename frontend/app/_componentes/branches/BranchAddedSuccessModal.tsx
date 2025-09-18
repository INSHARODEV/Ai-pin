// components/branches/BranchAddedSuccessModal.tsx
'use client';

import * as React from 'react';
import Modal from '@/components/ui/Modal';
import { CheckCircle2 } from 'lucide-react';

export default function BranchAddedSuccessModal({
  open,
  onClose,
  onAddAnother,
}: {
  open: boolean;
  onClose: () => void;
  onAddAnother: () => void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      hideCloseButton
      maxWidthClass='max-w-md'
    >
      <div className='flex flex-col items-center text-center'>
        <div className='mb-3 grid h-16 w-16 place-items-center rounded-full bg-green-50'>
          <CheckCircle2 className='h-8 w-8 text-green-600' />
        </div>
        <h3 className='mb-2 text-lg font-semibold text-gray-900'>
          Branch Added Successfully!
        </h3>
        <p className='mb-6 max-w-sm text-sm text-gray-600'>
          Add another one or head to the main company page.
        </p>
        <div className='flex gap-3'>
          <button
            onClick={onClose}
            className='rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700'
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onAddAnother();
            }}
            className='rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white'
          >
            Add another one
          </button>
        </div>
      </div>
    </Modal>
  );
}
