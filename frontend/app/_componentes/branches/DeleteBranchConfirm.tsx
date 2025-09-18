'use client';

import Modal from '@/components/ui/Modal';

export default function DeleteBranchConfirm({
  open,
  onClose,
  branchName,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  branchName: string;
  onConfirm: () => void;
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
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-red-500'
            viewBox='0 0 24 24'
            fill='currentColor'
          >
            <path d='M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm1 15h-2v-2h2zm0-4h-2V7h2z' />
          </svg>
        </div>
        <h3 className='mb-1 text-lg font-semibold text-gray-900'>
          Are you sure you want to delete{' '}
          <span className='underline'>{branchName}</span>?
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
