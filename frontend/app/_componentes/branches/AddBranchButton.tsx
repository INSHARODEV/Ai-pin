'use client';

import React from 'react';
import { Plus } from 'lucide-react';

export default function AddBranchButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='inline-flex items-center gap-2 rounded-xl bg-[#0D70C8] px-4 py-2 text-white hover:bg-[#0D70B8] transition'
    >
      Add branch <Plus className='h-4 w-4' />
    </button>
  );
}
