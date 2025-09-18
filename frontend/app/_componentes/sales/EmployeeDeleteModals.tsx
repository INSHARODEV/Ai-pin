// components/sales/EmployeeDeleteModals.tsx
'use client';

import * as React from 'react';
import Modal from '@/components/ui/Modal';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export function EmployeeDeleteConfirm({
  open,
  onClose,
  employeeName,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  employeeName: string;
  onConfirm: () => Promise<void> | void;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      hideCloseButton
      maxWidthClass='max-w-md'
    >
      <div className='flex flex-col items-center text-center'>
        <div className='mb-3 grid h-16 w-16 place-items-center rounded-full bg-red-50'>
          <AlertCircle className='h-8 w-8 text-red-500' />
        </div>
        <h3 className='mb-1 text-lg font-semibold text-gray-900'>
          Are you sure you want to delete{' '}
          <span className='underline'>{employeeName}</span>?
        </h3>
        <p className='mb-6 max-w-sm text-sm text-gray-600'>
          If you delete it, you won’t be able to return and you will lose all
          its data.
        </p>

        <div className='flex w-full justify-center gap-3'>
          <button
            onClick={onConfirm}
            className='w-28 rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white'
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className='w-28 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700'
          >
            No
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function EmployeeDeleteSuccess({
  open,
  onClose,
  onBack,
}: {
  open: boolean;
  onClose: () => void;
  onBack: () => void;
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
        <h3 className='mb-6 text-lg font-semibold text-gray-900'>
          Member Deleted Successfully!
        </h3>
        <button
          onClick={onBack}
          className='rounded-xl bg-[#0D70C8] px-4 py-2 text-sm font-semibold text-white'
        >
          Back to company page
        </button>
      </div>
    </Modal>
  );
}
