'use client';

import Modal from '@/components/ui/Modal';

export default function DeleteBranchSuccess({
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
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-8 w-8 text-green-600'
            viewBox='0 0 24 24'
            fill='currentColor'
          >
            <path d='M10 15.172l8.95-8.95 1.414 1.415L10 18 3.636 11.636 5.05 10.222z' />
          </svg>
        </div>
        <h3 className='mb-6 text-lg font-semibold text-gray-900'>
          Branch Deleted Successfully!
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
