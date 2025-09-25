'use client';

import React from 'react';
import { X } from 'lucide-react';

export default function AddEmployeeSuccess({
  isOpen,
  onClose,
  onAddAnother,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddAnother: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'>
      <div className='w-full max-w-xl rounded-2xl bg-white shadow-xl'>
        <div className='flex justify-end px-6 pt-6'>
          <button
            type='button'
            onClick={onClose}
            className='rounded-full p-1 text-gray-400 hover:bg-gray-100'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        <div className='px-6 pb-6 -mt-4 text-center'>
          {/* Green check emblem */}
          <div className='mx-auto mb-4 h-24 w-24 rounded-full bg-green-100 p-4'>
            <div className='h-full w-full rounded-full bg-green-500 text-white grid place-items-center text-4xl'>
              ✓
            </div>
          </div>

          <h3 className='text-xl font-semibold text-gray-900'>
            Employee Added Successfully!
          </h3>
          <p className='mt-2 text-gray-500'>
            Add another one or head to the main employees page.
          </p>

          <div className='mt-6 flex items-center justify-center gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='rounded-xl bg-gray-100 px-5 py-2 font-medium text-gray-700 hover:bg-gray-200'
            >
              Close
            </button>
            <button
              type='button'
              onClick={onAddAnother}
              className='rounded-xl bg-[#0D70C8] px-5 py-2 font-medium text-white hover:bg-blue-700'
            >
              Add another one
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
